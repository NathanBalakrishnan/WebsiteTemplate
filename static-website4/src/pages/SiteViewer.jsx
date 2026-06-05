import { useParams } from "react-router-dom";
import siteData from "../data/multisiteData.json";

export default function SitePreview() {
  const { siteId } = useParams();

  const site = siteData.websites.find(
    (item) => item.id === siteId
  );

  if (!site) return <h2>Website Not Found</h2>;

  return (
    <div data-theme={site.themes[0].id}>
      {/* Navbar */}
      <nav className="navbar">
        {site.navigation.map((item) => (
          <div key={item.name}>
            {item.type === "link" ? (
              <a href="#">{item.name}</a>
            ) : (
              <div className="dropdown">
                <span>{item.name}</span>

                <div className="dropdown-menu">
                  {item.menuItems.map((menu) => (
                    <a key={menu}>{menu}</a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Home */}
      <section className="hero">
        <img src={site.home.image} />

        <h1>{site.home.tagline}</h1>

        <p>{site.home.description}</p>

        <button>{site.home.primaryCta}</button>
      </section>

      {/* About */}
      <section>
        <h2>{site.about.title}</h2>

        {Object.entries(site.about.sections).map(
          ([title, value]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{value}</p>
            </div>
          )
        )}
      </section>

      {/* Courses */}
      <section>
        <h2>{site.courses.title}</h2>

        {Object.entries(site.courses.details).map(
          ([course, value]) => (
            <div key={course}>
              <h3>{course}</h3>
              <p>{value}</p>
            </div>
          )
        )}
      </section>

      {/* Achievements */}
      <section>
        <h2>{site.achievements.title}</h2>

        {site.achievements.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </section>

      {/* Contact */}
      <section>
        <h2>{site.contact.title}</h2>

        <p>{site.contact.address}</p>
        <p>{site.contact.phone}</p>
        <p>{site.contact.email}</p>
      </section>
    </div>
  );
}