import {
  Links,
  Link,
  NavLink,
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
        <nav className="p-6 bg-slate-800 min-h-screen">
          <a href="/snippets">
            <img className="w-11/12 mt-4 mb-10" src="/images/logo.png" alt="" />
          </a>
          <p className="text-slate-400 text-sm mb-1">Snippet library</p>
          <ul className="mb-5">
            {/* <li>
              <div className="flex text-slate-200 px-3 py-2 duration-200 hover:bg-slate-700 hover:rounded-md">
                <i className="ri-book-open-line"></i>
                <Link to="/snippets" className="ml-2">
                  All snippets
                </Link>
              </div>
            </li> */}
            <li>
              {/* <div className="flex text-slate-200 px-3 py-2 duration-200 hover:bg-slate-700 hover:rounded-md">
                
                <NavLink to="/mysnippets" className={({ isActive }) =>
              isActive ? "text-slate-700" : undefined
            }>
                  <i className="ri-book-open-line ml-2"></i>
                  My snippets
                </NavLink>
              </div> */}
              <NavLink to="/snippets">
                {({ isActive }) => (
                  <div className={isActive ? "flex text-slate-200 px-3 py-2 duration-200 bg-slate-700 rounded-md mb-1" : "flex text-slate-200 px-3 py-2 duration-200 hover:bg-slate-700 hover:rounded-md mb-1"}>
                    <i className="ri-book-open-line mr-2"></i>
                    All snippets
                  </div>
                )}
              </NavLink>
              <NavLink to="/mysnippets">
                {({ isActive }) => (
                  <div className={isActive ? "flex text-slate-200 px-3 py-2 duration-200 bg-slate-700 rounded-md mb-1" : "flex text-slate-200 px-3 py-2 duration-200 hover:bg-slate-700 hover:rounded-md mb-1"}>
                    <i className="ri-book-open-line mr-2"></i>
                    My snippets
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/favorite">
                {({ isActive }) => (
                  <div className={isActive ? "flex text-slate-200 px-3 py-2 duration-200 bg-slate-700 rounded-md" : "flex text-slate-200 px-3 py-2 duration-200 hover:bg-slate-700 hover:rounded-md"}>
                    <i className="ri-heart-line mr-2"></i>
                    Favourite
                  </div>
                )}
              </NavLink>
            </li>
          </ul>
          <ul className="mb-5">
            <p className="text-slate-400 text-sm mb-1">Coding languages</p>
            {langArray.map((lang) => {
                return (
                  <li key={lang}>
                    {/* <div className="flex text-slate-200 px-3 py-2 duration-200 hover:bg-slate-700 hover:rounded-md">
                      <i className="ri-code-line"></i>
                      <Link to={`/${lang}`} className="ml-2">
                        {lang}
                      </Link>
                    </div> */}
                    <NavLink to={`/${lang}`}>
                      {({ isActive }) => (
                        <div className={isActive ? "flex text-slate-200 px-3 py-2 duration-200 bg-slate-700 rounded-md mb-1" : "flex text-slate-200 px-3 py-2 duration-200 hover:bg-slate-700 hover:rounded-md mb-1"}>
                          <i className="ri-code-line mr-2"></i>
                          {lang}
                        </div>
                      )}
                    </NavLink>
                  </li>
                  );
              })}
          </ul>
          <ul className="mb-5">
            <p className="text-slate-400 text-sm mb-1">Add new snippet</p>
            <li>
              {/* <div className="flex text-slate-200 px-3 py-2 duration-200 hover:bg-slate-700 hover:rounded-md">
              <i className="ri-add-line"></i>
                <Link to="/new" className="ml-2">
                  New snippet
                </Link>
              </div> */}
              <NavLink to="/new">
                {({ isActive }) => (
                  <div className={isActive ? "flex text-slate-200 px-3 py-2 duration-200 bg-slate-700 rounded-md" : "flex text-slate-200 px-3 py-2 duration-200 hover:bg-slate-700 hover:rounded-md"}>
                    <i className="ri-add-line mr-2"></i>
                    New snippet
                  </div>
                )}
              </NavLink>
            </li>
          </ul>
          <ul>
            <p className="text-slate-400 text-sm mb-1">My account</p>
            <li>
              <div className="flex text-slate-200 px-3 py-2 duration-200 hover:bg-slate-700 hover:rounded-md">
              <i className="ri-account-circle-line"></i>
                <Link to="/login" className="ml-2">
                  Log in
                </Link>
              </div>
            </li>
          </ul>
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
