import { Button, Image, Link } from '@nextui-org/react'
import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { getContact } from '~/lib/data'

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.contactId, 'Missing contactId param')
  const contact = await getContact(params.contactId)
  if (!contact) {
    throw new Response('Not Found', { status: 404 })
  }
  return json({ contact })
}

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>()

  return (
    <div className="flex gap-8">
      <div>
        {contact.avatar ? (
          <Image width={240} height={240} radius="lg" isBlurred src={contact.avatar} />
        ) : (
          <Image width={240} height={240} radius="lg" isBlurred src="https://via.placeholder.com/240x240" />
        )}
      </div>

      <div className="flex flex-col">
        <h1 className="my-2 text-3xl font-bold">
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i className="italic opacity-50">No Name</i>
          )}{' '}
        </h1>

        {contact.twitter && (
          <Link href={`https://twitter.com/${contact.twitter}`} isExternal className="text-xl">
            {contact.twitter}
          </Link>
        )}

        {contact.notes && <p className="mt-2 opacity-70">{contact.notes}</p>}

        <div className="mt-6 flex gap-3">
          <Form action="edit">
            <Button type="submit" variant="bordered">
              Edit
            </Button>
          </Form>
          <Form
            action="destroy"
            method="post"
            onSubmit={(e) => {
              const response = confirm('Are you sure you want to delete this contact?')
              if (!response) e.preventDefault()
            }}
          >
            <Button type="submit" variant="bordered">
              Delete
            </Button>
          </Form>
        </div>
      </div>
    </div>
  )
}
