import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "remix";
import styles from "~/tailwind.css";
import customStyles from "~/custom.css";
import connectDb from "~/db/connectDb.server.js";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
  {
    rel: "stylesheet",
    href: customStyles,
  },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css",
  }
];

export function meta() {
  return {
    charset: "utf-8",
    title: "Remix + MongoDB",
    viewport: "width=device-width,initial-scale=1",
  };
}

export async function loader() {
  const db = await connectDb();
  const snippets = await db.models.Snippet.find();
  return snippets;
}

export async function redirect() {
  return redirect("/snippets");
}

export default function App() {
  
  const snippets = useLoaderData();
  var langs = new Set(snippets.map(snippet => snippet.lang));
  var langArray = Array.from(langs);
    return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 text-slate-800 font-sans grid grid-cols-[300px_1fr] gap-4">
        <header className="p-6 bg-slate-800 min-h-screen">
          <a href="/snippets">
            <img className="w-11/12 mt-4 mb-10" src="/images/logo.png" alt="" />
          </a>
          <p className="text-slate-400 text-sm">Snippet library</p>
          <ul>
            <li>
              <div className="ml-3 flex text-slate-200">
                <i className="ri-book-open-line"></i>
                <Link to="/snippets" className="ml-2 hover:underline">
                  All snippets
                </Link>
              </div>
            </li>
            <li>
              <div className="ml-3 flex text-slate-200">
                <i className="ri-heart-line"></i>
                <Link to="/favorite" className="ml-2 hover:underline">
                  Favorite snippets
                </Link>
              </div>
            </li>
          </ul>

          <br />
          
          <ul>
            <p className="text-slate-400 text-sm">Coding languages</p>
            {langArray.map((lang) => {
                return (
                  <li key={lang}>
                    <div className="ml-3 flex text-slate-200">
                      <i className="ri-code-line"></i>
                      <Link to={`/${lang}`} className="ml-2 hover:underline">
                        {lang}
                      </Link>
                    </div>
                  </li>
                  );
              })};
          </ul>

          <br />

          <ul>
            <p className="text-slate-400 text-sm">Add new snippet</p>
            <li>
              <div className="ml-3 flex text-slate-200">
              <i className="ri-add-line"></i>
                <Link to="/new" className="ml-2 hover:underline">
                  New snippet
                </Link>
              </div>
            </li>
          </ul>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
