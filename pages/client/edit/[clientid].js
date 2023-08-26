import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getClientByClientId } from '../../../utils/databaseCalls/clientData';
import AddClient from '../../../components/forms/createClient';

export default function EditClient() {
  const [client, setClient] = useState({});
  const router = useRouter();
  const { clientId } = router.query;

  useEffect(() => {
    getClientByClientId(clientId).then(setClient);
  }, [clientId]);

  return (
    <>
      <AddClient clientObj={client} />;
    </>
  );
}
