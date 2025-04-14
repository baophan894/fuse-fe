// import { collaborators } from '../_mock/collaborators';
// import { notFound } from 'next/navigation';
// import CollaboratorModal from './collaborator-modal';

// type TCollaboratorViewPageProps = {
//   collaboratorId: string;
// };

// export default function CollaboratorViewPage({ collaboratorId }: TCollaboratorViewPageProps) {
//   let collaborator = null;
//   let pageTitle = 'Create New Collaborator';

//   if (collaboratorId !== 'new') {
//     collaborator = collaborators.find(c => c.id === collaboratorId);

//     if (!collaborator) {
//       notFound();
//     }

//     pageTitle = `Edit Collaborator`;
//   }

//   return <CollaboratorModal initialData={collaborator} pageTitle={pageTitle} />;
// }
