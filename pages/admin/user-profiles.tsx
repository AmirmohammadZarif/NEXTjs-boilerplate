import React, { useState, useEffect, FormEvent } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../hoc/withAuth'
import { Spinner, Pagination, Message, Search } from '../../components'
import moment from 'moment'
import Image from 'next/image'
import apiHook from '../../api'
import { IProfile } from '../../models/Profile'

interface Item extends Omit<IProfile, 'user'> {
  user: { _id: string; email: string }
  image: string
  name: string
}

const UserProfiles = () => {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')

  const getApi = apiHook({
    key: ['user-profiles'],
    method: 'GET',
    url: `auth/user-profiles?page=${page}&q=${q}&limit=${25}`,
  })?.get

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (!q) getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  // TableView
  const table = {
    header: ['Name', 'Address', 'Phone', 'Email'],
    body: ['name', 'address', 'phone', 'user.email'],
    createdAt: 'createdAt',
    image: 'image',
    data: getApi?.data,
  }

  const name = 'User Profiles List'

  return (
    <>
      <Head>
        <title>User Profiles</title>
        <meta property="og:title" content="User Profiles" key="title" />
      </Head>

      <div className="ms-auto text-end">
        <Pagination data={table.data} setPage={setPage} />
      </div>

      {getApi?.isLoading ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message variant="danger" value={getApi?.error} />
      ) : (
        <div className="table-responsive bg-light p-3 mt-2">
          <div className="d-flex align-items-center flex-column mb-2">
            <h3 className="fw-light text-muted">
              {name}
              <sup className="fs-6"> [{table?.data?.total}] </sup>
            </h3>

            <div className="col-auto">
              <Search
                placeholder="Search by name"
                setQ={setQ}
                q={q}
                searchHandler={searchHandler}
              />
            </div>
          </div>
          <table className="table table-sm table-border">
            <thead className="border-0">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: Item, i: number) => (
                <tr key={i}>
                  <td>
                    <Image
                      width="30"
                      height="30"
                      src={item?.image}
                      alt={item?.name}
                      className="img-fluid rounded-pill"
                    />
                  </td>
                  <td>{item?.name}</td>
                  <td>{item?.address}</td>
                  <td>{item?.phone}</td>
                  <td>{item?.user?.email}</td>

                  <td>{moment(item?.createdAt).format('lll')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(UserProfiles)), {
  ssr: false,
})