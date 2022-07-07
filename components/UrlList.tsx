import React, { FC } from 'react';
import toast from 'react-hot-toast';

type ListProps = {
  listItem: any;
  setListUrls: Function;
  listUrls: Array<string>;
};

const UrlList: FC<ListProps> = ({ listItem, setListUrls, listUrls }) => {
  const copyText = (e: { preventDefault: () => void; }, i: number) => {
    e.preventDefault();
    if (listItem !== null) {
      if (listItem.current !== null) {
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
      }
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

  return (
    <div className="url-list--wrapper">
      {listUrls.length > 0 && <h1>Shortened URLs</h1>}
      {listUrls.map((singleUrl: string, idx: number) => (
        <div key={`${singleUrl}${idx}`} className="url-list--item">
          <input
            type="text"
            disabled={true}
            defaultValue={singleUrl}
            ref={el => listItem.current[idx] = el}
          />
          <button
            type="button"
            className="btn"
            onClick={(e) => copyText(e, idx)}
          >
            Copy text
          </button>
          <button
            type="button"
            className="btn"
            onClick={(e) => removeUrl(e, idx)}
          >
            Remove URL
          </button>
        </div>
      ))}
    </div>
  )
}

export default UrlList;
