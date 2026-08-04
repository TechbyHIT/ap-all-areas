import Link from "next/link";
import { HOMEPAGE_CONTENT } from "@/data/static-page-content";
import { HOME_MATERIAL_ROWS } from "@/data/home-page";

export function HomeMaterials() {
  return (
    <section className="home-section home-section--white" id="materials">
      <div className="home-container">
        <header className="home-section-head">
          <p className="home-eyebrow">Material &amp; quality</p>
          <h2 className="home-h2">Product and Material Quality</h2>
          <p className="home-lead">{HOMEPAGE_CONTENT.materialQualityInfo}</p>
        </header>

        <div className="home-table-wrap">
          <table className="home-table">
            <thead>
              <tr>
                <th scope="col">Aspect</th>
                <th scope="col">Invisible Grills</th>
                <th scope="col">Safety Nets</th>
              </tr>
            </thead>
            <tbody>
              {HOME_MATERIAL_ROWS.map((row) => (
                <tr key={row.aspect}>
                  <th scope="row">{row.aspect}</th>
                  <td>{row.invisible}</td>
                  <td>{row.nets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="home-note">
          Final material selection depends on the opening, location, installation
          surface and customer safety requirements. Read the{" "}
          <Link href="/materials-guide/">materials guide</Link> and{" "}
          <Link href="/safety-guide/">safety guide</Link> for more detail.
        </p>
      </div>
    </section>
  );
}
