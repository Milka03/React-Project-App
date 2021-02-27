import React, {useMemo} from 'react';
import {useDropzone} from 'react-dropzone';
import {Button, Table } from 'react-bootstrap';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  height: '100%',
  width: '100%'
};
const activeStyle = {borderColor: '#2196f3'};
const acceptStyle = {borderColor: '#00e676'};
const rejectStyle = {borderColor: '#ff1744'};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 50,
  height: 50,
  padding: 4,
  boxSizing: 'border-box'
};
const thumbInner = {display: 'flex',minWidth: 0,overflow: 'hidden'};
const img = {display: 'block',width: 'auto',height: '100%'};

function FlatImageDropzone(props) {
  const {getRootProps, getInputProps, open, isDragActive, isDragAccept, isDragReject} = useDropzone({
    accept: 'image/*', maxFiles: 20, noClick: true, noKeyboard: true, disabled: props.disabled,
    onDrop: (acceptedFiles) => { 
      props.onAddingFiles(acceptedFiles);
    }
  });
  const prettyBytes = require('pretty-bytes');
  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [isDragActive,isDragReject,isDragAccept]);
  
  const rowStyle = (rowIndex) => {
    if (rowIndex === props.clickedRow) {
      return {backgroundColor: '#24a0ed' };
    }
  };
  const renderTableData = () => {
    return props.files.map((file, index) => (
        <tr key={index} 
            style={rowStyle(index)}
            onClick={() => props.onRowClick(index, file.preview)}>
          <td>
            <div style={thumb}>
              <div style={thumbInner}>
                <img src={file.preview} style={img} />
              </div>
            </div>
          </td>
          <td>{file.fileName}</td>
          <td>{prettyBytes(file.file.size)}</td>
          <td>      
            <Button variant="danger" type="button" 
              onClick={(e) => props.onRemovingFile(e, index, file.preview)} >X
            </Button>
          </td>
        </tr>
      )
    )
  }
  return (
    <div {...getRootProps({style})} >
      <input {...getInputProps()} />
      <div style={{height:'90%', maxHeight: '600px', overflow: 'scroll', width: '100%'}}>
        <Table>
          <tbody>{renderTableData()}</tbody>
        </Table>
      </div>
      <Button variant="primary" 
        type="button" 
        style={{position: 'absolute', bottom: 20}}
        hidden={props.disabled}
        onClick={open}>UPLOAD MORE IMAGES
      </Button>
    </div>
  );
}

export default FlatImageDropzone;