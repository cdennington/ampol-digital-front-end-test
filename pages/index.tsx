import React, {
  useRef,
  useState,
  useEffect,
} from 'react';
import type { NextPage } from 'next';
import toast from 'react-hot-toast';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [listUrls, setListUrls] = useState([]);
  const url = useRef('');
  const listItem = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      const storedUrls = localStorage.getItem('urls');

      if (storedUrls !== null) {
        if (storedUrls.length === 0) {
          const parseStoredUrls = JSON.parse(storedUrls);
          setListUrls(parseStoredUrls);
        }
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const isValidHttpUrl = () => {
    let newUrl;

    if (url.current === '') {
      return false;
    }

    try {
      newUrl = new URL(url.current);
    } catch (err) {
      console.error(err);
      return false;
    }

    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  };

  const copyText = (e: { preventDefault: () => void; }, i: number) => {
    e.preventDefault();
    const copyText = listItem.current[i];

    if (typeof copyText !== 'undefined' && copyText !== null) {
      try {
        copyText.select();
        copyText.setSelectionRange(0, 99999); /* For mobile devices */
        navigator.clipboard.writeText(copyText.value);
        toast.success('URL copied');
      } catch (err) {
        console.error(err);
        toast.error('issue copying URL');
      }
    } else {
      toast.error('issue copying URL');
    }
  };

  const removeUrl = (e: { preventDefault: () => void; }, i: number) => {
    e.preventDefault();
    try {
      const cloneList = JSON.parse(JSON.stringify(listUrls));
      cloneList.splice(i, 1);
      setListUrls(cloneList);
      localStorage.setItem('urls', JSON.stringify(cloneList));
      toast.success('URL Deleted');
    } catch (err) {
      console.error(err);
      toast.error('issue deleting URL');
    }
  };

  const createShortUrl = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (isValidHttpUrl()) {
      fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url.current)}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.ok) {
            const cloneList = JSON.parse(JSON.stringify(listUrls));
            cloneList.push(data.result.full_share_link);
            setListUrls(cloneList);
            localStorage.setItem('urls', JSON.stringify(cloneList));
            toast.success('URL shortened');
          } else {
            toast.error(data.error);
          }
        });
    } else {
      toast.error('Invalid URL');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => url.current = e.target.value;

  return (
    <div className={styles.container}>
      <form onSubmit={(e) => createShortUrl(e)}>
        <div>
          <label htmlFor="link" className="form-label">Enter a Link:</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => { handleInputChange(e); }}
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      {listUrls.length > 0 && <h1>Shortened URLs</h1>}
      {listUrls.map((singleUrl, idx) => (
        <div key={`${singleUrl}${idx}`}>
          <input
            type="text"
            defaultValue={singleUrl}
            ref={el => listItem.current[idx] = el}
          />
          <button type="button" onClick={(e) => copyText(e, idx)}>Copy text</button>
          <button type="button" onClick={(e) => removeUrl(e, idx)}>Remove URL</button>
        </div>
      ))}
    </div>
  )
}

export default Home
