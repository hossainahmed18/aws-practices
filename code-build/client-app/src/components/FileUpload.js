import { useState } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { userActivityAdded } from '../redux/UserActivityAction';

function FileUpload() {
    const [selectedFile, setSelectedFile] = useState({});
    const [uploaded, setUploaded] = useState(false);
    const [errorMessage, setErrorerrorMessage] = useState("");
    const [uploadTime, setUploadTime] = useState("");
    const filerOptions = useSelector((state) => state.filerOptions);
    const dispatch = useDispatch();

    const uploadFile = async () => {
        try {
            const response = await axios.get(process.env.LAMBDA_API_ENDPOINT, { params: { fileName: selectedFile.name } });
            await axios.put(response.data.uploadURL, selectedFile);
            stateChengeAfterUpload();
        } catch (error) {
            setErrorerrorMessage(error.toString());
        }
    }
    const storeUserActivity = async () => {
        const requestBody = {
            user: filerOptions.selectedUser,
            customer: filerOptions.selectedCustomer.Name,
            fileName: selectedFile.name,
            fileType: selectedFile.type,
            fileSize: selectedFile.size,
            uploadTime: uploadTime
        }
        try {
            await axios.post(process.env.LAMBDA_API_ENDPOINT + '/userActivity', requestBody);
            stateChengeAfterStoringInfo();
            dispatch(userActivityAdded());
        } catch (error) {
            setErrorerrorMessage(error.toString());
        }
    }
    const stateChengeAfterUpload = () => {
        setUploaded(true);
        setUploadTime(new Date().toISOString());
        setErrorerrorMessage("");
    }
    const stateChengeAfterStoringInfo = () => {
        setSelectedFile({});
        setErrorerrorMessage("");
    }
    return (
        <div className='col-4 mt-5'>
            <h3>File Uploader</h3>
            <input type="file" onChange={(event) => setSelectedFile(event.target.files[0])}></input>
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
                errorMessage.length > 0 && <p>{errorMessage}</p>
            }
            {
                (errorMessage.length === 0 && uploaded) && <button className='btn btn-sm btn-success mb-3 mt-3' onClick={() => storeUserActivity()}>Store Activity</button>
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