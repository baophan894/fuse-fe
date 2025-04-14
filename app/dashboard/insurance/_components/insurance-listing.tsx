"use client"
import { searchParamsCache } from '@/lib/searchparams';

import { Insurance } from '@/constants/data';
import InsuranceRequestList from './insurance-tables/insurance-request-list';


export default async function InsuranceListingPage() {

  return (
    <InsuranceRequestList
     // columns={columns}
     // data={collaborators}
     //totalItems={collaborators.length}
    />
  );
}
