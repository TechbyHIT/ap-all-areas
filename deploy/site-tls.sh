#!/usr/bin/env bash
# Issue or renew a Let's Encrypt certificate for a registered site.
#
#   sudo bash deploy/site-tls.sh <slug>
#   sudo bash deploy/site-tls.sh <slug> --email you@example.com
#   sudo bash deploy/site-tls.sh <slug> --dry-run     # staging, no rate limits
#
# Only names that actually resolve are requested. Let's Encrypt rejects the
# entire order if one name returns NXDOMAIN, so asking for a www alias that was
# never added to DNS fails the apex domain too.
set -uo pipefail

. "$(cd "$(dirname "$0")" && pwd)/lib/sites.sh"

[ $# -ge 1 ] || die "usage: site-tls.sh <slug> [--email ADDR] [--dry-run]"
SLUG_ARG="$1"
shift
EMAIL=""
DRY_RUN=0

while [ $# -gt 0 ]; do
  case "$1" in
  --email)
    EMAIL="$2"
    shift 2
    ;;
  --dry-run)
    DRY_RUN=1
    shift
    ;;
  *) die "unknown option: $1" ;;
  esac
done

require_cmd certbot
load_site "$SLUG_ARG"

log "TLS for $SLUG ($DOMAIN)"

# nginx must be valid first: certbot runs `nginx -t` itself and aborts on failure.
if ! nginx -t >/dev/null 2>&1; then
  warn "nginx -t fails, and certbot runs it too. Its output:"
  nginx -t 2>&1 | sed 's/^/      /'
  die "fix the nginx config first"
fi

dns_resolves "$DOMAIN" || die "$DOMAIN does not resolve — add an A record to this server's IP and wait for DNS"

DOMAIN_FLAGS="$(certbot_domain_flags)"
info "requesting:$(printf '%s' "$DOMAIN_FLAGS" | sed 's/-d //g')"

CERTBOT_ARGS="--nginx $DOMAIN_FLAGS --redirect --agree-tos --non-interactive"
if [ -n "$EMAIL" ]; then
  CERTBOT_ARGS="$CERTBOT_ARGS --email $EMAIL"
else
  CERTBOT_ARGS="$CERTBOT_ARGS --register-unsafely-without-email"
  info "no --email given: registering without one (no expiry warnings)"
fi
[ "$DRY_RUN" = 1 ] && CERTBOT_ARGS="$CERTBOT_ARGS --dry-run"

# shellcheck disable=SC2086
if ! certbot $CERTBOT_ARGS; then
  warn "certbot failed"
  info "log: /var/log/letsencrypt/letsencrypt.log"
  info "if a name reported NXDOMAIN, add its DNS record and re-run"
  exit 1
fi

if [ "$DRY_RUN" = 1 ]; then
  log "Dry run succeeded — re-run without --dry-run to issue the real certificate"
  exit 0
fi

log "Certificate installed"
curl -sS -o /dev/null -w '    https://%{http_code} from https://'"$DOMAIN"'\n' \
  "https://$DOMAIN/" 2>/dev/null || warn "could not verify over HTTPS yet"

# Aliases left out above can be folded in later without reissuing from scratch.
for alias in $ALIASES; do
  [ -n "$alias" ] || continue
  dns_resolves "$alias" && continue
  cat <<EOF

    '$alias' was skipped because it has no DNS record. To include it later, add
    a CNAME for it pointing at $DOMAIN, then:

      sudo bash deploy/site-tls.sh $SLUG
EOF
done
