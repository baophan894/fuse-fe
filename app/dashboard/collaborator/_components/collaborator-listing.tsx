"use client"
import { searchParamsCache } from '@/lib/searchparams';

import { Collaborator } from '@/constants/data';
import { columns } from './collaborator-tables/columns';
import CollaboratorRequestList from './collaborator-tables/collaborator-table';

export default async function CollaboratorListingPage() {

  return (
    <CollaboratorRequestList
     // columns={columns}
     // data={collaborators}
     //totalItems={collaborators.length}
    />
  );
}
