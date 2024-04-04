import {
  Form,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from '@remix-run/react'
import { LinksFunction, LoaderFunctionArgs, MetaFunction, json, redirect } from '@remix-run/node'
import { Button, Input, NextUIProvider } from '@nextui-org/react'
import stylesheet from '~/styles/index.css?url'
import { createEmptyContact, getContacts } from '~/lib/data'
import { cn } from '~/lib/utils'
import { Loader, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

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
      <body className={cn('font-serif antialiased text-foreground bg-background')}>
        <NextUIProvider>
          {children}
          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
      </body>
    </html>
  )
}

export async function loader({ request }: LoaderFunctionArgs) {
  const q = new URL(request.url).searchParams.get('q')
  const contacts = await getContacts(q)
  return json({ contacts, q })
}

export async function action() {
  const contact = await createEmptyContact()
  return redirect(`/contacts/${contact.id}/edit`)
}

export default function App() {
  const navigation = useNavigation()

  return (
    <div className="flex max-h-dvh">
      <aside className="flex-1 overflow-auto p-8">
        <Bar />
        <List />
      </aside>
      <main className={cn('flex-[4] p-12 delay-100', { 'animate-pulse': navigation.state === 'loading' })}>
        <Outlet />
      </main>
    </div>
  )
}

export function Bar() {
  const { q } = useLoaderData<typeof loader>()
  const [query, setQuery] = useState(q || '')
  const submit = useSubmit()
  const navigation = useNavigation()
  const isSearching = navigation.location && new URLSearchParams(navigation.location.search).has('q')

  useEffect(() => {
    setQuery(q || '')
  }, [q])

  return (
    <div className="mb-6 flex gap-2">
      <Form
        onChange={(e) => {
          const isFirstSearch = q === null
          submit(e.currentTarget, {
            replace: !isFirstSearch,
          })
        }}
      >
        <Input
          variant="bordered"
          placeholder="Search ..."
          isClearable
          startContent={isSearching ? <Loader size={18} className="animate-spin" /> : <SearchIcon size={18} />}
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => {
            setQuery('')
            submit(null)
          }}
        />
      </Form>
      <Form method="post">
        <Button type="submit" variant="bordered">
          New
        </Button>
      </Form>
    </div>
  )
}

export function List() {
  const { contacts } = useLoaderData<typeof loader>()

  return (
    <nav>
      {contacts.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {contacts.map((contact) => (
            <li key={contact.id}>
              <NavLink
                className={({ isActive, isPending }) =>
                  cn('delay-100', { active: isActive, 'animate-pulse': isPending })
                }
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
        <a className="italic opacity-70">No contacts</a>
      )}
    </nav>
  )
}
