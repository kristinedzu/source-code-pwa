import {
  Links,
  Link,
  NavLink,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  json
} from "remix";
import styles from "~/tailwind.css";
import customStyles from "~/custom.css";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "./routes/sessions.js";
import React from 'react';

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
    title: "SourceCode",
    viewport: "width=device-width,initial-scale=1",
  };
}

export async function loader({request}) {
  const session = await getSession(request.headers.get("Cookie"));
  loggedUserId = session.get("userId");
  const db = await connectDb();
  const snippets = await db.models.Snippet.find();
  return json ({
    snippets,
    user: await db.models.User.findById(session.get("userId")),
  });
}

export async function redirect() {
  return redirect("/snippets");
}

export default function App() {
  
  const data = useLoaderData();
  var langs = new Set(data.snippets.map(snippet => snippet.lang));
  var langArray = Array.from(langs);

  function openCloseNav(){
    const nav = document.getElementById("nav");
    nav.classList.toggle("open"); 
    console.log("Nav clicked!");
  }

  function closeNav(){
    const nav = document.getElementById("nav");
    nav.classList.remove("open"); 
  }

    return (
    <html lang="en">
      <head>
        <Meta />
        <link rel="manifest" href="/app.webmanifest?v=3" />
        <Links />
      </head>
      <body className="bg-slate-100 text-slate-800 font-sans grid sm:grid-cols-[1fr] lg:grid-cols-[300px_1fr] gap-4">
        <div onClick={openCloseNav} className="bg-slate-800 text-slate-100 p-4 sm:block md:block lg:hidden">
          <i className="ri-menu-5-line mr-2"></i>
        </div>
        <nav id="nav" className="nav px-6 pb-6 bg-slate-800 min-h-screen block fixed -left-full top-12  lg:relative lg:w-auto lg:block lg:top-0 lg:left-0">
          <a href="/snippets">
            <img className="w-11/12 mt-4 mb-10" src="/images/logo.png" alt="logo" />
          </a>
          <p className="text-slate-400 text-sm mb-1">Snippet library</p>
          <ul className="mb-5">
            <li>
              <NavLink to="/snippets">
                {({ isActive }) => (
                  <div className={isActive ? "flex text-slate-200 px-3 py-2 duration-200 bg-slate-700 rounded-md mb-1" : "flex text-slate-200 px-3 py-2 duration-200 hover:bg-slate-700 hover:rounded-md mb-1"} onClick={closeNav}>
                    <i className="ri-book-open-line mr-2"></i>
                    All snippets
                  </div>
                )}
              </NavLink>
              <NavLink to="/mysnippets">
                {({ isActive }) => (
                  <div className={isActive ? "flex text-slate-200 px-3 py-2 duration-200 bg-slate-700 rounded-md mb-1" : "flex text-slate-200 px-3 py-2 duration-200 hover:bg-slate-700 hover:rounded-md mb-1"} onClick={closeNav}>
                    <i className="ri-book-open-line mr-2"></i>
                    My snippets
                  </div>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/favorite">
                {({ isActive }) => (
                  <div className={isActive ? "flex text-slate-200 px-3 py-2 duration-200 bg-slate-700 rounded-md" : "flex text-slate-200 px-3 py-2 duration-200 hover:bg-slate-700 hover:rounded-md"} onClick={closeNav}>
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
                    <NavLink to={`/${lang}`}>
                      {({ isActive }) => (
                        <div className={isActive ? "flex text-slate-200 px-3 py-2 duration-200 bg-slate-700 rounded-md mb-1" : "flex text-slate-200 px-3 py-2 duration-200 hover:bg-slate-700 hover:rounded-md mb-1"} onClick={closeNav}>
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
              <NavLink to="/new">
                {({ isActive }) => (
                  <div className={isActive ? "flex text-slate-200 px-3 py-2 duration-200 bg-slate-700 rounded-md" : "flex text-slate-200 px-3 py-2 duration-200 hover:bg-slate-700 hover:rounded-md"} onClick={closeNav}>
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
                <Link to="/login" className="ml-2" onClick={closeNav}>
                {data.user? data.user?.username : "Log in" }
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
