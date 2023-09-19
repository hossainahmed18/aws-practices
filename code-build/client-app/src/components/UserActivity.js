import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import axios from 'axios';


const UserActivity = () => {
    const filerOptions = useSelector((state) => state.filerOptions);
    const totalUserActivities = useSelector((state) => state.totalUserActivities);
    const [errorMessage, setErrorerrorMessage] = useState("");
    const [userActivities, setUserActivities] = useState([]);

    useEffect(() => {
        loadUserActivities();
    }, [filerOptions, totalUserActivities])

    const loadUserActivities = async () => {
        try {
            const response = await axios.get(process.env.LAMBDA_API_ENDPOINT + '/userActivity', {
                params: setQueryParams()
            })
            setUserActivities(response.data.Message.Items);
            setErrorerrorMessage("");
        } catch (error) {
            setErrorerrorMessage(error.toString());
        }
    }

    const setQueryParams = () => {
        const queryParams = {};
        if (filerOptions.selectedCustomer.Name?.length > 0) {
            queryParams.customer = filerOptions.selectedCustomer.Name;
        }
        if (filerOptions.selectedUser?.length > 0) {
            queryParams.user = filerOptions.selectedUser;
        }
        if (filerOptions.startDate?.length > 0) {
            queryParams.startDate = filerOptions.startDate;
        }
        if (filerOptions.endDate?.length > 0) {
            queryParams.endDate = filerOptions.endDate;
        }
        return queryParams;
    }


    return (
        <div className="col-8 mt-5 p-5 border border-primary">
            <h5>User Activities</h5>
            {
                userActivities.map((userActivity) => {
                    return (
                        <div className='row border border-warning p-1 mb-1' key={userActivity.pk + userActivity.sk}>
                            <div className='col-3'> <p>customer: {userActivity.customer} </p></div>
                            <div className='col-3'><p> user: {userActivity.user} </p></div>
                            <div className='col-3'><p>fileName: {userActivity.fileName}</p></div>
                            <div className='col-3'><p>upliaded At: {userActivity.uploadTime}</p></div>
                        </div>

                    )
                })
            }
            {
                errorMessage.length > 0 && <p>{errorMessage}</p>
            }
        </div>
    );

}
const mapStateToProps = state => {
    return {
        totalUserActivities: state.totalUserActivities,
        filerOptions: state.filerOptions
    }
}

export default connect(mapStateToProps)(UserActivity);