import { useEffect, useState, useCallback, useRef } from 'react';
import EventTimeLine from './componets/event-time-line/EventTimeLine';
import { Container } from '@mui/material';

function App() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const totaltemCount = useRef(0);

  const fetchItems = useCallback(async () => {
    const res = await fetch(`http://localhost:3001/events?_page=${page}&_limit=15`);
    totaltemCount.current = res.headers.get('X-Total-Count');
    const postEvents = await res.json();
    setList((prevEvents) => [...prevEvents, ...postEvents]);
  }, [page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <Container
      sx={{ position: 'relative', top: '90px', fontSizeAdjust: 'from-font' }}
      component='section'
      maxWidth='sm'
    >
      <EventTimeLine
        height={450}
        list={list}
        loadMore={() => {
          setPage((prevPage) => prevPage + 1);
        }}
        hasMore={list.length < totaltemCount.current}
      />
    </Container>
  );
}

export default App;
