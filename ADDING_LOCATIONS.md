# Adding Locations

1. Add location to `src/data/initial-locations.ts` or import via admin bulk tools.
2. Set hierarchy: state → district → city/town → area/locality.
3. Keep defaults for bulk imports: `isServed=false`, `localDataVerified=false`, `contentReviewed=false`, `allowIndexing=false`.
4. Promote only when service availability and unique content are verified.
5. Create location page records, then city-service combinations.
6. Never claim a physical office unless a verified branch record exists.

Aliases (Vizag/Visakhapatnam, etc.) belong on the canonical location record.
