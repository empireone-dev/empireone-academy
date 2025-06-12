import React, { useEffect } from 'react'
import Layout from '../layout'
import ApplicantsTable from './sections/table'
import store from '@/app/store/store'
import { get_exams_thunk } from '@/app/redux/exam-thunk'

export default function Page() {

  useEffect(()=>{
    store.dispatch(get_exams_thunk())
  },[])
  return (
    <Layout>
      <ApplicantsTable />
    </Layout>
  )
}
