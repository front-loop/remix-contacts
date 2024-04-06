import { Button, Image, Link } from '@nextui-org/react'
import { type LoaderFunctionArgs, json, type ActionFunctionArgs } from '@remix-run/node'
import { Form, useFetcher, useLoaderData } from '@remix-run/react'
import { StarIcon } from 'lucide-react'
import invariant from 'tiny-invariant'
import { ContactRecord, getContact, updateContact } from '~/lib/data'

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.contactId, 'Missing contactId param')
  const contact = await getContact(params.contactId)
  if (!contact) {
    throw new Response('Not Found', { status: 404 })
  }
  return json({ contact })
}

export async function action({ params, request }: ActionFunctionArgs) {
  invariant(params.contactId, 'Missing contactId param')
  const formData = await request.formData()
  return updateContact(params.contactId, {
    favorite: formData.get('favorite') === 'true',
  })
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
        <div className="flex items-center gap-3">
          <h1 className="my-2 text-3xl font-bold">
            {contact.first || contact.last ? (
              <>
                {contact.first} {contact.last}
              </>
            ) : (
              <i className="italic opacity-50">No Name</i>
            )}{' '}
          </h1>
          <Favorite contact={contact} />
        </div>

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

export function Favorite({ contact }: { contact: Pick<ContactRecord, 'favorite'> }) {
  const fetcher = useFetcher()
  const favorite = fetcher.formData ? fetcher.formData.get('favorite') === 'true' : contact.favorite

  return (
    <fetcher.Form method="post">
      <Button type="submit" variant="light" isIconOnly name="favorite" value={favorite ? 'false' : 'true'}>
        {favorite ? <StarIcon className="fill-yellow-300 text-yellow-500" /> : <StarIcon />}
      </Button>
    </fetcher.Form>
  )
}
