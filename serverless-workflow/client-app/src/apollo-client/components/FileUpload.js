import { useState } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { userActivityAdded } from '../../redux/UserActivityAction';
import { useMutation } from '@apollo/client';
import { ADD_USER_ACTIVITY } from '../graphQl/Mutation'

function FileUpload() {
    const [selectedFile, setSelectedFile] = useState({});
    const [uploaded, setUploaded] = useState(false);
    const [uploadTime, setUploadTime] = useState("");
    const filerOptions = useSelector((state) => state.filerOptions);
    const dispatch = useDispatch();
    const [errorerrorMessage, setErrorerrorMessage] = useState("");

    const uploadFile = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_LAMBDA_API_END_POINT, { params: { fileName: selectedFile.name } });
            await axios.put(response.data.uploadURL, selectedFile);
            stateChengeAfterUpload();
        } catch (error) {
            setErrorerrorMessage(error);
        }
    }
    const storeUserActivity = async () => {
        addUserActivity({ variables: { customer: filerOptions.selectedCustomer.Name, fileName: selectedFile.name, fileSize: selectedFile.size, uploadTime: uploadTime, user: filerOptions.selectedUser } });
        stateChengeAfterStoringInfo();
        dispatch(userActivityAdded());

    }
    const [addUserActivity, { data, loading, error }] = useMutation(ADD_USER_ACTIVITY);
    
    const stateChengeAfterUpload = () => {
        setUploaded(true);
        setUploadTime(new Date().toISOString());
        setErrorerrorMessage("");
    }
    const stateChengeAfterStoringInfo = () => {
        setSelectedFile({});
        setUploaded(false);
    }
    return (
        <div className='col-4 mt-5'>
            <h3>File Uploader</h3>
            <input type="file" onChange={(event) => { setSelectedFile(event.target.files[0]); setUploaded(false) }}></input>
            {
                (filerOptions.selectedUser.length > 0 && selectedFile?.size > 0 && !uploaded) && <button className='btn btn-sm btn-success mb-3 mt-3' onClick={() => uploadFile()} >Upload</button>
            }
            {
                selectedFile?.size > 0 &&
                <div className='ms-5'>
                    <span className='row'>File Name: {selectedFile.name}</span>
                    <span className='row'>File Type: {selectedFile.type}</span>
                    <span className='row'>File Size: {selectedFile.size}</span>
                    {
                        (uploadTime.length > 0 && uploaded) && <span className='row'>upLoaded At: {uploadTime}</span>
                    }
                </div>
            }
            {
                (
                    error?.toString().length > 0 || errorerrorMessage?.toString().length > 0) && (
                    <>
                        <p>{error?.toString()}</p>
                        <p>{errorerrorMessage?.toString()}</p>
                    </>
                )
            }
            {
                uploaded && <button className='btn btn-sm btn-success mb-3 mt-3' onClick={() => storeUserActivity()}>Store Activity</button>
            }
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        filerOptions: state.filerOptions
    }
}
const mapDispatchToProps = () => {
    return {
        userActivityAdded: () => userActivityAdded()
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FileUpload);