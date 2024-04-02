import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
} from '@remix-run/react'
import { LinksFunction, MetaFunction, json } from '@remix-run/node'
import { NextUIProvider } from '@nextui-org/react'
import stylesheet from '~/styles/index.css?url'
import { getContacts } from '~/utils/data'
import { clsx } from 'ts-clsx'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }]

export const meta: MetaFunction = () => {
  return [{ title: 'Remix Contacts' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-dvh font-serif antialiased">
        <NextUIProvider>
          {children}
          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
      </body>
    </html>
  )
}

export async function loader() {
  const contacts = await getContacts()
  return json({ contacts })
}

export default function App() {
  const { contacts } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  return (
    <div className="flex max-h-dvh">
      <aside className="flex-1 overflow-auto p-8">
        <nav>
          {contacts.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) => clsx({ active: isActive, pending: isPending })}
                    to={`contacts/${contact.id}`}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>No contacts</p>
          )}
        </nav>
      </aside>
      <main className={clsx('flex-[5] p-10', { loading: navigation.state === 'loading' })}>
        <Outlet />
      </main>
    </div>
  )
}
