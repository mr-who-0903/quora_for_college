import React, { useState, useEffect } from 'react';
import download from 'downloadjs';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import Loader from 'react-loader-spinner';

const FilesList = () => {
  const [filesList, setFilesList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFilesList = async () => {
      try {
        const { data } = await axios.get(`/getAllFiles`);
        setErrorMsg('');
        setFilesList(data);
        setLoading(false);
      } catch (error) {
        error.response && setErrorMsg(error.response.data);
      }
    };

    getFilesList();
  }, []);

  const downloadFile = async (id, path, mimetype) => {
    try {
      const result = await axios.get(`download/${id}`, {
        responseType: 'blob'
      });
      const split = path.split('/');
      const filename = split[split.length - 1];
      setErrorMsg('');
      return download(result.data, filename, mimetype);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg('Error while downloading file. Try again later');
      }
    }
  };

  const dateFormatter = (date) =>{

    const allDateTime = date;
    const allDateTimeArr = allDateTime.split('T');
    const allDate = allDateTimeArr[0].split('-');

    var months = [ "Jan", "Feb", "Mar", "April", "May", "June", 
       "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];

    return (allDate[2]+" "+months[allDate[1]-1]+", "+allDate[0]);
  }

  return (
    <div className="files-container">
      {errorMsg && <p className="errorMsg">{errorMsg}</p>}
      <table className="files-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Uploaded on</th>
            <th>Description</th>
            <th>Download File</th>
          </tr>
        </thead>

        <tbody>
          {filesList.length > 0 ? (
            filesList.map(
              ({ _id, title, description, file_path, file_mimetype, createdAt }) => (
                <tr key={_id}>
                  <td className="file-title">{title}</td>
                  <td>{dateFormatter(createdAt)}</td>
                  <td className="file-description">{description}</td>
                  <td>
                    <button
                      href="#/"
                      className="download-btn"
                      onClick={() => downloadFile(_id, file_path, file_mimetype)}>
                      Download
                    </button>
                  </td>
                </tr>
              )
            )
          ) : ( loading ? null :
            <tr>
              <td colSpan={3} style={{ fontWeight: '300' }}>
                No files found. Please add some.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {loading ? 
      <div style={{textAlign: 'center', marginTop:"2rem" }}>
            <Loader type="ThreeDots" color="#6b0f0c" height={50} width={50}/>
      </div>
      : null
      }
    </div>
  );
};

export default FilesList;