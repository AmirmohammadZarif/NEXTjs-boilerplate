import { actionButton } from '@/components/dForms'
import DateTime from '@/lib/dateTime'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'

type Column = {
  editHandler: (item: any) => void
  isPending: boolean
  deleteHandler: (item: any) => void
  modal?: string
}

export const columns = ({
  editHandler,
  isPending,
  deleteHandler,
  modal,
}: Column) => [
  { header: 'Name', accessorKey: 'name', active: true },
  { header: 'Email', accessorKey: 'email', active: true },
  { header: 'Role', accessorKey: 'role.name', active: true },
  {
    header: 'Confirmed',
    accessorKey: 'confirmed',
    active: true,
    cell: ({ row: { original } }: any) =>
      original?.confirmed ? (
        <FaCircleCheck className='text-green-500' />
      ) : (
        <FaCircleXmark className='text-red-500' />
      ),
  },
  {
    header: 'Blocked',
    accessorKey: 'blocked',
    active: true,
    cell: ({ row: { original } }: any) =>
      !original?.blocked ? (
        <FaCircleCheck className='text-green-500' />
      ) : (
        <FaCircleXmark className='text-red-500' />
      ),
  },
  {
    header: 'CreatedAt',
    accessorKey: 'createdAt',
    active: true,
    cell: ({ row: { original } }: any) =>
      DateTime(original?.createdAt).format('DD-MM-YYYY'),
  },

  {
    header: 'Action',
    active: true,
    cell: ({ row: { original } }: any) =>
      actionButton({ editHandler, isPending, deleteHandler, modal, original }),
  },
]
