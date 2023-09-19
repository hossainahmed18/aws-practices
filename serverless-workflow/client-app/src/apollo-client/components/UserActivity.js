import { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { useLazyQuery } from "@apollo/client";
import { LIST_ACTIVITY_BY_CUSTOMER_USER } from '../graphQl/Query'

const UserActivity = () => {
    const filerOptions = useSelector((state) => state.filerOptions);
    const totalUserActivities = useSelector((state) => state.totalUserActivities);

    useEffect(() => {
        setQuery();
    }, [filerOptions, totalUserActivities])

    const [loadUserActivities, { error, loading, data: userActivities }] = useLazyQuery(
        LIST_ACTIVITY_BY_CUSTOMER_USER,
        { variables: { customer: filerOptions.selectedCustomer.Name, user: filerOptions.selectedUser } }
    );
    const setQuery = () => {
        if (filerOptions.selectedCustomer.Name?.length > 0 && filerOptions.selectedUser?.length > 0) {
            loadUserActivities();
        }
    }
    return (
        <div className="col-8 mt-5 p-5 border border-primary">
            <h5>User Activities</h5>
            {
                loading && <p>loading</p>
            }
            {
                userActivities?.getuserActivitiesByCustomerAndUser?.map((userActivity, index) => {
                    return (
                        <div className='row border border-warning p-1 mb-1' key={index}>
                            <div className='col-3'> <p>customer: {userActivity.customer} </p></div>
                            <div className='col-3'><p> user: {userActivity.user} </p></div>
                            <div className='col-3'><p>fileName: {userActivity.fileName}</p></div>
                            <div className='col-3'><p>upliaded At: {userActivity.uploadTime}</p></div>
                        </div>

                    )
                })
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