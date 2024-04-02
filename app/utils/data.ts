import { matchSorter } from 'match-sorter'
import sortBy from 'sort-by'
import invariant from 'tiny-invariant'

type ContactMutation = {
  id?: string
  first?: string
  last?: string
  avatar?: string
  twitter?: string
  notes?: string
  favorite?: boolean
}

export type ContactRecord = ContactMutation & {
  id: string
  createdAt: string
}

const fakeContacts = {
  records: {} as Record<string, ContactRecord>,

  async getAll(): Promise<ContactRecord[]> {
    return Object.values(fakeContacts.records).sort(sortBy('-createdAt', 'last'))
  },

  async get(id: string): Promise<ContactRecord | null> {
    return fakeContacts.records[id] || null
  },

  async create(values: ContactMutation): Promise<ContactRecord> {
    const id = values.id || crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const newContact = { id, createdAt, ...values }
    fakeContacts.records[id] = newContact
    return newContact
  },

  async set(id: string, values: ContactMutation): Promise<ContactRecord> {
    const contact = await fakeContacts.get(id)
    invariant(contact, `No concat found for ${id}`)
    const updatedContact = { ...contact, ...values }
    fakeContacts.records[id] = updatedContact
    return updatedContact
  },

  destroy(id: string) {
    delete fakeContacts.records[id]
    return null
  },
}

export async function getContacts(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  let contacts = await fakeContacts.getAll()
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ['first', 'last'] })
  }
  return contacts
}

export async function getContact(id: string) {
  return fakeContacts.get(id)
}

export async function createEmptyContact() {
  return fakeContacts.create({})
}

export async function updateContact(id: string, updates: ContactMutation) {
  const contact = await getContact(id)
  if (!contact) {
    throw new Error(`No contact found for ${id}`)
  }
  await fakeContacts.set(id, { ...contact, ...updates })
  return contact
}

export async function deleteContact(id: string) {
  fakeContacts.destroy(id)
}

const fakeData = [
  {
    avatar: 'https://sessionize.com/image/124e-400o400o2-wHVdAuNaxi8KJrgtN3ZKci.jpg',
    first: 'Shruti',
    last: 'Kapoor',
    twitter: '@shrutikapoor08',
  },
  {
    avatar: 'https://sessionize.com/image/1940-400o400o2-Enh9dnYmrLYhJSTTPSw3MH.jpg',
    first: 'Glenn',
    last: 'Reyes',
    twitter: '@glnnrys',
  },
  {
    avatar: 'https://sessionize.com/image/9273-400o400o2-3tyrUE3HjsCHJLU5aUJCja.jpg',
    first: 'Ryan',
    last: 'Florence',
  },
  {
    avatar: 'https://sessionize.com/image/d14d-400o400o2-pyB229HyFPCnUcZhHf3kWS.png',
    first: 'Oscar',
    last: 'Newman',
    twitter: '@__oscarnewman',
  },
  {
    avatar: 'https://sessionize.com/image/fd45-400o400o2-fw91uCdGU9hFP334dnyVCr.jpg',
    first: 'Michael',
    last: 'Jackson',
  },
  {
    avatar: 'https://sessionize.com/image/b07e-400o400o2-KgNRF3S9sD5ZR4UsG7hG4g.jpg',
    first: 'Christopher',
    last: 'Chedeau',
    twitter: '@Vjeux',
  },
]

fakeData.forEach((contact) => {
  fakeContacts.create({
    ...contact,
    id: `${contact.first.toLowerCase()}-${contact.last.toLocaleLowerCase()}`,
  })
})
