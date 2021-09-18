import { useEffect, useRef, useState } from 'react';
import { List, AutoSizer } from 'react-virtualized';
import styles from './EventTimeLine.css';
import Box from '@mui/material/Box';
import { CircularProgress, IconButton, Skeleton } from '@mui/material';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

const COLOR_MAP = Object.freeze({
  GET: 'red',
  POST: 'AntiqueWhite',
  DELETE: 'Aqua',
  PUT: 'Aquamarine',
  PATCH: 'Azure',
  HEAD: 'Beige',
  TRACE: 'Bisque',
  CONNECT: 'Black',
  AUTH: 'Green',
  OPTIONS: 'BlueViolet',
});

function EventTimeLine({ list, loadMore, hasMore, height }) {
  const [scrollToIndex, setScrollToIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const cacheStopIndex = useRef(0);

  useEffect(() => {
    if (cacheStopIndex.current === 0) {
      return;
    }
    setIsLoading(() => {
      setScrollToIndex(cacheStopIndex.current);
      return false;
    });
  }, [list.length]);

  const _noRowsRenderer = () => {
    return <div className={styles.noRows}>No rows</div>;
  };
  const _rowRenderer = ({ index, style, isScrolling, key }) => {
    return !isScrolling ? (
      <Box
        component='div'
        className={`row ${index === selectedRowIndex ? 'highlighted' : ''}`}
        key={key}
        style={style}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedRowIndex(index);
          const pos = list.length - 1 - index;
          if (pos < 5) {
            setScrollToIndex(list.length - 1);
          } else setScrollToIndex(index + 2);
        }}
      >
        <Box component='div' className='content'>
          <Box component='span'>{new Date(list[index].timestamp).toLocaleTimeString()}</Box>
        </Box>
        <Box component='div' className='content method'>
          <Box
            component='span'
            style={{
              backgroundColor: COLOR_MAP[list[index].method],
            }}
            dangerouslySetInnerHTML={{ __html: `${list[index].method}` }}
          />
        </Box>
        <Box component='div' className='content'>
          <Box component='span' dangerouslySetInnerHTML={{ __html: list[index].endpoint_path }} />
        </Box>
      </Box>
    ) : (
      <Box component='div' key={key} style={style} className='row'>
        <Skeleton sx={{ width: '80%', height: height / 5 }} animation='pulse' />
      </Box>
    );
  };

  const _onRowsRendered = ({ stopIndex }) => {
    if (hasMore && stopIndex === list.length - 1) {
      setIsLoading(true);
      loadMore();
      cacheStopIndex.current = stopIndex;
    }
  };


  const _onScroll = (direction) => {
    const scrollFrom = selectedRowIndex ? selectedRowIndex : 0;
    //TODO: Cover up/down actions senarios 
    if (direction === 'down') {
      setSelectedRowIndex(scrollFrom + 1);
    } else {
      setSelectedRowIndex(scrollFrom - 1);
    }
  };
  const EventList = () => {
    return (
      <Box component='div' sx={{ textAlign: 'center' }}>
        <Box component='h1'>Events Timeline</Box>
        <Box component='div'>
          {!isLoading ? (
            <AutoSizer disableHeight>
              {({ width }) => (
                <List
                  className='list'
                  height={height}
                  noRowsRenderer={_noRowsRenderer}
                  rowCount={list.length}
                  rowHeight={height / 5}
                  rowRenderer={_rowRenderer}
                  width={width}
                  onRowsRendered={_onRowsRendered}
                  scrollToIndex={scrollToIndex}
                />
              )}
            </AutoSizer>
          ) : (
            <CircularProgress sx={{ position: 'relative', top: '150px' }} />
          )}
        </Box>
        <Box component='div'>
          <IconButton color='secondary' aria-label='up' onClick={() => _onScroll('up')}>
            <ArrowUpward />
          </IconButton>
          <IconButton color='primary' aria-label='down' onClick={() => _onScroll('down')}>
            <ArrowDownward />
          </IconButton>
        </Box>
      </Box>
    );
  };

  return <EventList />;
}

export default EventTimeLine;
