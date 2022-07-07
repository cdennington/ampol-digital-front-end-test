import React, {
  useRef,
  useState,
  useEffect,
} from 'react';
import type { NextPage } from 'next';
import toast from 'react-hot-toast';
import UrlList from '../components/UrlList';

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [listUrls, setListUrls] = useState([]);
  const url = useRef('');
  const listItem = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      const storedUrls = localStorage.getItem('urls');

      if (storedUrls !== null) {
        const parseStoredUrls = JSON.parse(storedUrls);
        if (parseStoredUrls.length > 0) {
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

  const createShortUrl = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (isValidHttpUrl()) {
      setLoading(true);
      fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url.current)}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.ok) {
            const cloneList = JSON.parse(JSON.stringify(listUrls));
            cloneList.push(data.result.full_share_link);
            setListUrls(cloneList);
            localStorage.setItem('urls', JSON.stringify(cloneList));
            toast.success('URL shortened');
            setLoading(false);
          } else {
            toast.error(data.error);
            setLoading(false);
          }
        });
    } else {
      toast.error('Invalid URL');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => url.current = e.target.value;

  return (
    <div>
      <form className="shorten-url-form--wrapper" onSubmit={(e) => createShortUrl(e)}>
        <label htmlFor="link" className="form-label">Enter a Link:</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => { handleInputChange(e); }}
        />
        <button type="submit" className={`btn${loading ? ' loading' : ''}`}>
          <span>Submit</span>
          <div className="lds-ring">
            <div />
            <div />
            <div />
            <div />
          </div>
        </button>
      </form>
      <UrlList
        listItem={listItem}
        setListUrls={setListUrls}
        listUrls={listUrls}
      />
    </div>
  )
}

export default Home
