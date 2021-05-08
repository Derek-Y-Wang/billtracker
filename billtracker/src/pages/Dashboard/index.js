import React, {useContext, useEffect, useState} from "react";
import {Button, Grid} from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import {AuthContext} from '../../contexts/AuthContext';
// styles
import useStyles from "./styles";
// components
import Chart from "react-google-charts";

import HelloImg from "../../assets/hello.svg";

import Snackbar from '@material-ui/core/Snackbar';

import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Dashboard(props) {
    var classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const [email, setEmail] = React.useState('');
    const [list, setList] = React.useState([]);
    const [internet, setInternet] = React.useState(0);
    const [food, setFood] = React.useState(0);
    const [electricity, setElectricity] = React.useState(0);
    const [phone, setPhone] = React.useState(0);
    const [water, setWater] = React.useState(0);
    const [utilities, setUtilities] = React.useState(0);
    const [other, setOther] = React.useState(0);
    const [sixInternet, setSixInternet] = React.useState([0, 0, 0, 0, 0, 0]);
    const [sixPhone, setSixPhone] = React.useState([0, 0, 0, 0, 0, 0]);
    const [sixFood, setSixFood] = React.useState([0, 0, 0, 0, 0, 0]);
    const [sixUtilities, setSixUtilities] = React.useState([0, 0, 0, 0, 0, 0]);
    const [lastSixMonths, setLastSixMonths] = React.useState([]);
    const [value, setValue] = React.useState("");
    const [billCount, setBillCount] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [totalAmt, setTotalAmt] = useState(0);
    const [totalAmtYearly, setTotalAmtYearly] = useState(0);
    const [upcomingBills, setUpcomingBills] = React.useState([]);
    const {isAuth, updateAuth, updateToken} = useContext(AuthContext);
    const [textValue, setTextValue] = React.useState('Monthly');
    const [reviewCount, setReviewCount] = React.useState(0);
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const checkAuth = () => {
        fetch('https://billtracker-server.herokuapp.com/api/user/verify', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                jwt_token: localStorage.token
            }
        }).then(response => response.json()).then(data => {
            if (data !== true) {
                window.location.href = "/";
            }
        }).catch(err => {
            console.log("Error");
        });
    }

    const getUserInfo = () => {
        fetch('https://billtracker-server.herokuapp.com/api/user/profile', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                jwt_token: localStorage.token
            }
        }).then(response => response.json()).then(data => {
            setValue(data.firstName);
            setEmail(data.email);
            getBillStatus(data.email);
            getAllReviews(data.email);
            getLastSixMonths();
        }).catch(err => {
            console.log("Error");
        });
    }

    const getAllReviews = (email) => {
        var formBody = [];
        var encodedKey = encodeURIComponent("email");
        var encodedValue = encodeURIComponent(email);
        formBody.push(encodedKey + "=" + encodedValue);
        formBody = formBody.join("&");
        fetch('https://billtracker-server.herokuapp.com/api/reviewsUser', {
            method: 'POST',
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }).then(response => response.json()).then(data => {
            setReviewCount(data.length);
        }).catch(err => {
            console.log("Error");
        });
    }

    const getBillStatus = (email) => {
        var formBody = [];
        var encodedKey = encodeURIComponent("email");
        var encodedValue = encodeURIComponent(email);
        formBody.push(encodedKey + "=" + encodedValue);
        formBody = formBody.join("&");
        fetch('https://billtracker-server.herokuapp.com/api/user/bill', {
            method: 'POST',
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }).then(response => response.json()).then(data => {
            setList(data);
            setBillCount(data.length);
            getPieData(data, data.length);
            getTrendData(data, data.length, lastSixMonths);
            getUpcomingBills(data, data.length);
        }).catch(err => {
            alert(err);
        });
    }

    const getLastSixMonths = () => {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var today = new Date();
        var d;
        d = new Date(today.getFullYear(), today.getMonth() - 5, 1);
        var month1 = monthNames[d.getMonth()];
        d = new Date(today.getFullYear(), today.getMonth() - 4, 1);
        var month2 = monthNames[d.getMonth()];
        d = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        var month3 = monthNames[d.getMonth()];
        d = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        var month4 = monthNames[d.getMonth()];
        d = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        var month5 = monthNames[d.getMonth()];
        d = new Date(today.getFullYear(), today.getMonth() - 0, 1);
        var month6 = monthNames[d.getMonth()];
        setLastSixMonths([month1, month2, month3, month4, month5, month6]);


    }

    const getPieData = (data_list, data_length) => {
        var d = new Date();
        var total_values = new Array();
        total_values[0] = 0;
        total_values[1] = 0;
        total_values[2] = 0;
        total_values[3] = 0;
        total_values[4] = 0;
        total_values[5] = 0;
        total_values[6] = 0;

        var total_values2 = new Array();
        total_values2[0] = 0;
        total_values2[1] = 0;
        total_values2[2] = 0;
        total_values2[3] = 0;
        total_values2[4] = 0;
        total_values2[5] = 0;
        total_values2[6] = 0;
    
        var i;
        for (i = 0; i < data_length; i++) {
                if (data_list[i].category == 'Internet') {
                    if(data_list[i].type == 'Monthly') {
                        total_values[0] += data_list[i].billamt;
                        total_values2[0] += data_list[i].billamt*12;
                    }
                    else if(data_list[i].type == 'Yearly') {
                        total_values2[0] += data_list[i].billamt;
                    }
                    setInternet(total_values[0]);
                } else if (data_list[i].category == 'Food') {
                    if(data_list[i].type == 'Monthly') {
                        total_values[1] += data_list[i].billamt;
                        total_values2[1] += data_list[i].billamt*12;
                    }
                    else if(data_list[i].type == 'Yearly') {
                        total_values2[1] += data_list[i].billamt;
                    }
                    setFood(total_values[1]);
                } else if (data_list[i].category == 'Electricity') {
                    if(data_list[i].type == 'Monthly') {
                        total_values[2] += data_list[i].billamt;
                        total_values2[2] += data_list[i].billamt*12;
                    }
                    else if(data_list[i].type == 'Yearly') {
                        total_values2[2] += data_list[i].billamt;
                    }
                    setElectricity( total_values[2]);
                } else if (data_list[i].category == 'Phone') {
                    if(data_list[i].type == 'Monthly') {
                        total_values[3] += data_list[i].billamt;
                        total_values2[3] += data_list[i].billamt*12;
                    }
                    else if(data_list[i].type == 'Yearly') {
                        total_values2[3] += data_list[i].billamt;
                    }
                    setPhone(total_values[3]);
                } else if (data_list[i].category == 'Water') {
                    if(data_list[i].type == 'Monthly') {
                        total_values[4] += data_list[i].billamt;
                        total_values2[4] += data_list[i].billamt*12;
                    }
                    else if(data_list[i].type == 'Yearly') {
                        total_values2[4] += data_list[i].billamt;
                    }
                    setWater(total_values[4]);
                } else if (data_list[i].category == 'Utilities') {
                    if(data_list[i].type == 'Monthly') {
                        total_values[5] += data_list[i].billamt;
                        total_values2[5] += data_list[i].billamt*12;
                    }
                    else if(data_list[5].type == 'Yearly') {
                        total_values2[5] += data_list[i].billamt;
                    }
                    setUtilities(total_values[5]);
                } else if (data_list[i].category == 'Other') {
                    if(data_list[i].type == 'Monthly') {
                        total_values[6] += data_list[i].billamt;
                        total_values2[6] += data_list[i].billamt*12;
                    }
                    else if(data_list[i].type == 'Yearly') {
                        total_values2[6] += data_list[i].billamt;
                    }
                    setOther(total_values[6]);
                }
        }
        setTotalAmtYearly(total_values2[0]+ total_values2[1]+total_values2[2]+total_values2[3]+total_values2[4]+total_values2[5]+total_values2[6])
        setTotalAmt(total_values[0]+ total_values[1]+total_values[2]+total_values[3]+total_values[4]+total_values[5]+total_values[6])
    }

        // gets monthly and yearly bills that are scheduled in the next 7 days
        const getUpcomingBills = (data_list, data_length) => {
            var months = {
                'January' : '0',
                'Feburary' : '1',
                'March' : '2',
                'April' : '3',
                'May' : '4',
                'June' : '5',
                'July' : '6',
                'August' : '7',
                'September' : '8',
                'October' : '9',
                'Novomber' : '10',
                'December' : '11'
            }
            var today = new Date();
            var nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);
            var upcoming = new Array();
            var i;
            for (i = 0; i < data_length; i++) {
                var billDate = new Date();
                if (data_list[i].type === 'Monthly') {
                    billDate.setDate(data_list[i].day.slice(0, data_list[i].day.indexOf("t")));
                } else if (data_list[i].type === 'Yearly') {
                    billDate.setDate(data_list[i].day.slice(0, data_list[i].day.indexOf("t")));
                    billDate.setMonth(months[data_list[i].month]);
                } else {
                    billDate.setDate(today.getDate()-1);
                }
                if (billDate >= today && billDate <= nextWeek) {
                    console.log(data_list[i]);
                    upcoming.push([data_list[i], billDate]);
                }
            }
            setUpcomingBills(upcoming);
        }

    const getTrendData = (data_list, data_length, lastSix) => {
        var d = new Date();     
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var today = new Date();
        var sixMonths = new Array();
        var d;
        d = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        sixMonths[0] = monthNames[d.getMonth()];
        d = new Date(today.getFullYear(), today.getMonth() - 5, 1);
        sixMonths[1] = monthNames[d.getMonth()];
        d = new Date(today.getFullYear(), today.getMonth() - 4, 1);
        sixMonths[2] = monthNames[d.getMonth()];
        d = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        sixMonths[3] = monthNames[d.getMonth()];
        d = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        sixMonths[4] = monthNames[d.getMonth()];
        d = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        sixMonths[5] = monthNames[d.getMonth()];

        var total_values = new Array();
        total_values[0] = 0;
        total_values[1] = 0;
        total_values[2] = 0;
        total_values[3] = 0;
        var h = 5;
        var i;
        for (i = 0; i < 6; i++) {
            
            var j = i;
            var k;
            for (k = 0; k < data_length; k++) {
                if(data_list[k].type === "Monthly") {
                    var monthRn = d.getMonth();
                    if (data_list[k].category === 'Internet') {
                        total_values[0] += data_list[k].billamt;
                        let sixInternetCopy = [...sixInternet];
                        sixInternetCopy[h] = total_values[0];
                        setSixInternet(sixInternetCopy);
                    } else if (data_list[k].category === 'Food') {
                        total_values[1] += data_list[k].billamt;
                        let sixFoodCopy = [...sixFood];
                        sixFoodCopy[h] = total_values[1];
                        setSixFood(sixFoodCopy);
                    } else if (data_list[k].category === 'Phone') {
                        total_values[2] += data_list[k].billamt;
                        let sixPhoneCopy = [...sixPhone];
                        sixPhoneCopy[h] = total_values[2];
                        setSixPhone(sixPhoneCopy);
                    } else if (data_list[k].category === 'Utilities') {
                        total_values[3] += data_list[k].billamt;
                        let sixUtilitiesCopy = [...sixUtilities];
                        sixUtilitiesCopy[h] = total_values[3];
                        setSixUtilities(sixUtilitiesCopy);
                    } 
                }
                else if (data_list[k].type === "Yearly") {
                    if (data_list[k].month === sixMonths[j] && data_list[k].category === 'Internet') {
                        total_values[0] += data_list[k].billamt;
                        let sixInternetCopy = [...sixInternet];
                        sixInternetCopy[h] = total_values[0];
                        console.log("test"+total_values[h]);
                        setSixInternet(sixInternetCopy);
                    } else if (data_list[k].month === sixMonths[j] && data_list[k].category === 'Food') {
                        total_values[1] += data_list[k].billamt;
                        let sixFoodCopy = [...sixFood];
                        sixFoodCopy[h] = total_values[1];
                        setSixFood(sixFoodCopy);
                    } else if (data_list[k].month === sixMonths[j] && data_list[k].category === 'Phone') {
                        total_values[2] += data_list[k].billamt;
                        let sixPhoneCopy = [...sixPhone];
                        sixPhoneCopy[h] = total_values[2];
                        setSixPhone(sixPhoneCopy);
                    } else if (data_list[k].month === sixMonths[j] && data_list[k].category === 'Utilities') {
                        total_values[3] += data_list[k].billamt;
                        let sixUtilitiesCopy = [...sixUtilities];
                        sixUtilitiesCopy[h] = total_values[3];
                        setSixUtilities(sixUtilitiesCopy);
                    } 
                }
            }
            h--;
        }
    }
    const toggleButton = () => {
        if(textValue == "Monthly") {
            setTextValue("Yearly");
        }
        else {
            setTextValue("Monthly");
        }
    }
    useEffect(() => {
        getUserInfo();
        checkAuth();
    }, []);

    return (
        <div className={classes.cardGrid}>
            <Snackbar anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }} open={open} autoHideDuration={1000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Login successful
                </Alert>
            </Snackbar>
            <div className={classes.main_greeting}>
                <img src={HelloImg} className={classes.hello_img} alt=""/>
                <div style={{flex: 1, flexDirection: "row"}}>
                    <Typography className={classes.main_greeting_h1} variant="h1">Hello {value} </Typography>
                    <Typography className={classes.main_greeting_p}>Welcome to your dashboard</Typography>
                </div>
            </div>
            <Grid container spacing={2}>
                <Grid item lg={3}
                      sm={6}
                      xl={3}
                      xs={12}>
                    <Paper className={classes.card} variant="outlined">
                        <CardActions>
                            <div className={classes.inner}>
                                <Typography noWrap variant="h6" size="small">Total Bills</Typography>
                                <Typography noWrap style={{position: 'relative', bottom: -80, right: 90}} variant="h2"
                                            size="small">{billCount}</Typography>
                            </div>
                        </CardActions>
                    </Paper>
                </Grid>
                <Grid item lg={3}
                      sm={6}
                      xl={3}
                      xs={12}>
                    <Paper className={classes.card} variant="outlined">
                        <CardActions>
                            <div className={classes.inner}>
                                <Typography variant="h6" size="small">Total Reviews</Typography>
                                <Typography style={{position: 'relative', bottom: -80, right: 120}} variant="h2"
                                            size="small">{reviewCount}</Typography>
                            </div>
                        </CardActions>
                    </Paper>
                </Grid>
                <Grid item lg={6}
                      sm={12}
                      xl={6}
                      xs={12}>
                    <Paper className={classes.card} variant="outlined">
                        <CardActions>
                            <Typography noWrap variant="h6" size="small">Upcoming Bills</Typography>
                        </CardActions>
                        <table>
                            <tr>
                                <th>Name</th>
                                <th>Due on</th>
                                <th>Amount Due</th>
                            </tr>
                            {upcomingBills.map((item) => (
                                <tr>
                                    <td>{item[0].name}</td>
                                    <td>{item[1].getMonth()+1 + " " + item[1].getDate()}</td>
                                    <td>{item[0].billamt}</td>
                                </tr>
                            ))}
                        </table>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <Paper className={classes.bottomCards} variant="outlined">
                        <CardActions>
                            <Typography variant="h6" size="small">Expected Total</Typography>
                            <Button color="primary" variant="contained" style={{textTransform: 'none'}} onClick={toggleButton}>{textValue}</Button>
                            <Typography id="expectedTotal" variant="h6" size="small"
                                        className={classes.expectedTotal}>{(textValue == "Monthly") ? ("$"+totalAmt) : ("$"+totalAmtYearly)}</Typography>
                        </CardActions>

                        <Chart
                            width={'100%'}
                            height={'95%'}
                            chartType="PieChart"
                            loader={<div>Loading Chart</div>}
                            data={[
                                ['Category', 'in dollars (CAD)'],
                                ['Utilities', utilities],
                                ['Food', food],
                                ['Internet', internet],
                                ['Mobile Phone', phone],
                                ['Electricity', electricity],
                                ['Water', water],
                                ['Other', other]
                            ]}
                            rootProps={{'data-testid': '2'}}
                            options={{
                                tooltip: {
                                    backgroundColor: "transparent",
                                }
                                // tooltip: { format: { value: function (value, ratio, id) { return value; } } }
                            }}
                        />
                    </Paper>
                </Grid>
                {/*<Grid item xs={12} sm={12} md={6}>*/}
                {/*    <Paper className={classes.bottomCards} variant="outlined">*/}
                {/*        <CardActions>*/}
                {/*            <Typography variant="h6" size="small">Goals</Typography>*/}
                {/*        </CardActions>*/}
                {/*    </Paper>*/}
                {/*</Grid>*/}
                <Grid item xs={12} sm={12} md={6}>
                    <Paper className={classes.bottomCards} variant="outlined">
                        <CardActions>
                            <Typography variant="h6" size="small">Expenses in the last 6 months</Typography>
                        </CardActions>

                        <Chart
                            width={'100%'}
                            height={'95%'}
                            chartType="Line"
                            loader={<div>Loading Chart</div>}
                            data={[
                                [
                                    'Months',
                                    'Utilities',
                                    'Food',
                                    'Internet',
                                    'Mobile Phone'
                                ],
                                [lastSixMonths[0], sixUtilities[5], sixFood[5], sixInternet[5], sixPhone[5]],
                                [lastSixMonths[1], sixUtilities[4], sixFood[4], sixInternet[4], sixPhone[4]],
                                [lastSixMonths[2], sixUtilities[3], sixFood[3], sixInternet[3], sixPhone[3]],
                                [lastSixMonths[3], sixUtilities[2], sixFood[2], sixInternet[2], sixPhone[2]],
                                [lastSixMonths[4], sixUtilities[1], sixFood[1], sixInternet[1], sixPhone[1]],
                                [lastSixMonths[5], sixUtilities[0], sixFood[0], sixInternet[0], sixPhone[0]]
                            ]}
                            rootProps={{'data-testid': '3'}}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

