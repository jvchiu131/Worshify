import { StyleSheet, Text, View, ImageBackground, Dimensions, ScrollView, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { child, onValue, ref, remove, update, set, get, runTransaction } from 'firebase/database';
import { db, auth } from '../../firebase';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AppliedProfile from './AppliedProfile';
import { EvilIcons } from '@expo/vector-icons';

import { Appbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { AirbnbRating, Rating } from 'react-native-ratings';
import { MaterialIcons } from '@expo/vector-icons';

const { height: screenHeight } = Dimensions.get('screen');
const { width: screenWidth } = Dimensions.get('screen');

const ClientGigDetails = ({ postID, handleBtnClose }) => {

    const [postDetails, setPostDetails] = useState([]);
    const [instruments, setInstruments] = useState([]);
    const [userData, setUserData] = useState([]);
    const [appliedUsers, setAppliedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [genre, setGenre] = useState([]);
    const [archived, setArchived] = useState(false);
    const [musicianGenre, setMusicianGenre] = useState([]);
    const [musicianInstrument, setMusicianInstrument] = useState([]);
    const user = auth.currentUser;
    const uid = user.uid;
    const navigation = useNavigation();
    const [userId, setUserId] = useState();
    const [selectedItem, setSelectedItem] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [status, setStatus] = useState();
    const [notification, setNotification] = useState()
    const [ratingsVisible, setRatingsVisible] = useState(false);
    const [rating, setRating] = useState(3);
    const [ratingTwo, setRatingTwo] = useState(3);
    const [ratingThree, setRatingThree] = useState(3);
    const [review, setReview] = useState('');
    // const [counter, setCounter] = useState(0);
    const showGigModal = () => setModalVisible(true);
    const hideGigModal = () => setModalVisible(false);
    const showRatings = () => setRatingsVisible(true);
    const hideRatings = () => setRatingsVisible(false);
    // Keep track of acceptance status for each user separately
    const [userAcceptanceStatus, setUserAcceptanceStatus] = useState({});
    const [acceptedVisible, setAcceptedVisible] = useState(false);
    const showAccepted = () => setAcceptedVisible(true);
    const hideAccepted = () => setAcceptedVisible(false);
    const [gigExist, setGigExist] = useState(false);
    const [schedule, setSchedule] = useState([]);

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Available', value: 'Available' },
        { label: 'Done', value: 'Done' },
        { label: 'Cancelled', value: 'Cancelled' },
        { label: 'Upcoming', value: 'Upcoming' }

    ]);
    const [gigStatus, setGigStatus] = useState(null);
    const [selectedUserKey, setSelectedUserKey] = useState(null);
    const [counter, setCounter] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [visible, setVisible] = useState(false);
    const [gigModal, setGigModal] = useState(false);
    const [doneBtnVisible, setDoneBtnVisible] = useState(false);
    const [availBtnVisible, setAvailBtnVisible] = useState(false);
    const [cancelBtnVisible, setCancelBtnVisible] = useState(false);
    const [closeBtnVisible, setCloseBtnVisible] = useState(false);
    const [onGoingBtnVisible, setOnGoingBtnVisible] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [gigInstrument, setGigInstrument] = useState([]);
    const [matchedMusicians, setMatchedMusicians] = useState([]);
    const [gigGenre, setGigGenre] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            // Update the count every second
            setCounter(prevCount => prevCount + 1);
        }, 300);


        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const instrumentName = instruments.map((inst) => inst.name)
        setGigInstrument(instrumentName);
    }, [counter])

    const handleItemPress = (key) => {
        setSelectedItem(key);
        setUserId(key)
        showGigModal()
    };

    const handleUserPress = (userKey) => {
        setSelectedUserKey(userKey);
        showRatings()
        hideAccepted()
        const variable = acceptedUsers.some((user) => user.key === selectedUserKey)
    };

    useEffect(() => {
        const dbRef = ref(db, 'gigPosts/' + postID);
        onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const gigData = {
                    key: snapshot.key,
                    Event_Type: snapshot.val().Event_Type,
                    postID: snapshot.val().postID,
                    GigName: snapshot.val().Gig_Name,
                    uid: snapshot.val().uid,
                    schedule: snapshot.val().schedule,
                    GenreNeeded: snapshot.val().Genre_Needed,
                    InstrumentsNeeded: snapshot.val().Instruments_Needed,
                    GigImage: snapshot.val().Gig_Image,
                    about: snapshot.val().about,
                    GigStatus: snapshot.val().gigStatus
                };

                setPostDetails(gigData);
                setGigStatus(gigData.GigStatus)
                setGigGenre(gigData.GenreNeeded)
                // setGigInstrument(gigData.InstrumentsNeeded);

            } else {
                handleBtnClose(false)
            }
        });

    }, [postID])

    useEffect(() => {
        const dbRef = ref(db, 'gigPosts/' + postID);
        onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                setSchedule(snapshot.val().schedule);
            } else {
                handleBtnClose(false)
            }
        });

    }, [postID])



    useEffect(() => {
        const userRef = ref(db, 'users/client/' + uid)
        onValue(userRef, (snapshot) => {
            const userData = {
                key: snapshot.key,
                firstName: snapshot.val().first_name,
                lastName: snapshot.val().lname,
                profilePic: snapshot.val().profile_pic,
                banningPoints: snapshot.val().banningPoints
            };
            setUserData(userData)
        });
    }, [postID])

    useEffect(() => {
        const pathRef = child(ref(db), 'gigPosts/' + postID + '/Instruments_Needed')
        onValue(pathRef, (snapshot) => {
            let data = [];
            snapshot.forEach((child) => {
                data.push(child.val());
            })
            setInstruments(data);
        })
    }, [])

    useEffect(() => {
        const pathRef = child(ref(db), 'gigPosts/' + postID + '/Genre_Needed')
        onValue(pathRef, (snapshot) => {
            let data = [];
            snapshot.forEach((child) => {
                data.push(child.val());
            })
            setGenre(data);
        })
    }, [])



    useEffect(() => {
        const musicianScore = appliedUsers.map((musician) => {
            const instrumentsMusician = musician.instrument;
            const genreMusician = musician.genre;
            // const genderMusician = musician.gender;
            setMusicianGenre(genreMusician);
            setMusicianInstrument(instrumentsMusician);

            // Check for gender match
            // const genderMatch = selectedGender === genderMusician ? 1 : 0;

            const totalItem = gigInstrument.length + gigGenre.length;
            const matchedGenre = genreMusician.filter((genre) => gigGenre.includes(genre));
            const matchedInstruments = instrumentsMusician.filter((instrument) => gigInstrument.includes(instrument));
            const calculatePercentage = ((matchedGenre.length + matchedInstruments.length) / totalItem) * 100;


            return { ...musician, calculatePercentage };

        });
        // Remove musicians with NaN or 0 percentage
        // const validMusicians = musicianScore.filter((musician) => !isNaN(musician.calculatePercentage) && musician.calculatePercentage > 0);
        const validMusicians = musicianScore.filter((musician) => !isNaN(musician.calculatePercentage));

        // Sort the musicians in descending order of percentage
        const musicianSorted = validMusicians.sort((a, b) => b.calculatePercentage - a.calculatePercentage);

        // // Take the top 5 musicians
        // const topMusicians = musicianSorted.slice(0, 5);

        // console.log(musicianScore);

        setMatchedMusicians(musicianSorted);


    }, [counter, gigGenre, gigInstrument,])



    const renderApplied = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleItemPress(item.key)}>
                <View style={styles.renderContainer}>
                    <View style={styles.imgContainers}>
                        <ImageBackground source={{ uri: item.profilePic }} style={styles.imgStyle}></ImageBackground>
                    </View>
                    <View style={styles.textContainer}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.nameStyle}>{item.firstName} {item.lastName}</Text>
                            <Text style={{ color: "#0EB080", fontWeight: 'bold' }}>{Math.round(item.calculatePercentage)}%</Text>
                            {userAcceptanceStatus[item.key] ? (<AntDesign name="checkcircle" size={15} color="#0EB080" />) : null}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    const renderSeparator = () => {
        return (
            <View style={{
                marginRight: 20,
                height: 0.5
            }} />
        )

    }
    useEffect(() => {
        const usersAppliedRef = ref(db, 'gigPosts/' + postID + '/usersApplied');
        onValue(usersAppliedRef, (snapshot) => {
            let userApp = [];
            let userStatus = {}; // Object to store acceptance status for each user

            snapshot.forEach((child) => {
                const userKey = child.key;
                const user = {
                    key: userKey,
                    firstName: child.val().firstName,
                    lastName: child.val().lastName,
                    profilePic: child.val().profilePic,
                    genre: child.val().genre,
                    instrument: child.val().instrument

                };
                userApp.push(user);


                // Check if this user has an acceptance status and store it in the userStatus object
                if (child.val().accepted) {
                    userStatus[userKey] = true;
                } else {
                    userStatus[userKey] = false;
                }
            });

            setAppliedUsers(userApp);
            setUserAcceptanceStatus(userStatus); // Set the individual acceptance statuses
            // getAcceptedUsers()

        });


    }, []);

    const getAcceptedUsers = () => {
        return appliedUsers.filter((user) => userAcceptanceStatus[user.key]);
    }

    const acceptedUsers = getAcceptedUsers();
    const acceptedUserKeys = acceptedUsers.map((user) => user.key);



    const handleRatingSubmission = async (userKey) => {
        const ratingRef = ref(db, 'users/musicianRatings/' + userKey + '/' + uid);
        try {
            const snapshot = await get(ratingRef);
            const existingData = snapshot.val();
            // Calculate average rating
            const averageRating = Math.round((parseInt(rating) + parseInt(ratingTwo) + parseInt(ratingThree)) / 3);

            if (existingData) {
                // // Update existing data
                const newData = {
                    ...existingData,
                    averageRating,
                    review,

                };
                await update(ratingRef, newData);

                hideRatings()
                showAccepted()
            } else {
                // Create new data if it doesn't exist
                const newData = {
                    rating: averageRating,
                    review: review,
                    userName: userData.firstName,
                    userLname: userData.lastName,
                    userPic: userData.profilePic
                };
                await set(ratingRef, newData);
                hideRatings()
                showAccepted()
            }
            setRating(null)
            setReview('');
            hideRatings()
            showAccepted()


        } catch (error) {
            console.error('Error handling rating:', error)
        }

    }
    //notify applied musicians if gig is edited
    const props = { userId, postID };
    //handles Gig Archive
    const archiveGig = () => {
        const archiveRef = ref(db, 'archiveGigs/' + uid + '/' + postID)
        set(archiveRef, postDetails)
        setArchived(true);
        handleBtnClose(false);
        deleteGig();
    }
    const deleteGig = async () => {
        setLoading(true);
        const dbRefUser = ref(db, 'gigPosts/' + postID)
        const dbRef = ref(db, 'users/client/' + uid + '/gigs/' + postID);
        remove(dbRef)
        await remove(dbRefUser)
            .then(() => { setLoading(false) })
            .catch((error) => console.log(error))
    }

    useEffect(() => {
        const dbRef = ref(db, 'gigPosts/' + postID + '/usersApplied/')

        onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                setStatus(snapshot.val().accepted);
            }
        })
    }, [counter])



    //handles the rating visibility
    useEffect(() => {
        setGigStatus(postDetails.GigStatus);

        if (postDetails.GigStatus === 'Done') {
            showAccepted()
        }
    }, [gigStatus])

    // Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
    async function sendDoneNotification(expoPushToken) {
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: 'Gig Done',
            body: 'A gig that you applied is done! Please rate and give your feedback to the event!',
            data: { someData: 'goes here' },
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const notificationRef = ref(db, 'users/usersNotification/' + userId)
        const newNotificationRef = push(notificationRef);
        await set(newNotificationRef, {
            title: 'Gig Done!',
            body: 'A gig that you applied is done! Please rate and give your feedback to the event!',
        })
    }


    const handleHide = (data) => {
        setModalVisible(data)
    };

    const handleSet = (index) => {
        // console.log(index)
        setSelectedIndex(index);
        // console.log(selectedIndex)
        setVisible(true)
    }

    const handleCloseSet = () => {
        setSelectedIndex(null);
        setVisible(false);
    }

    useEffect(() => {
        const addresses = schedule.map(item => item.date);
    }, [selectedIndex])


    const address = schedule.map(item => item.address);
    const date = schedule.map(item => item.date);
    const start = schedule.map(item => item.startTime);
    const end = schedule.map(item => item.endTime);




    const handleGigModal = () => {
        setGigModal(true);
    }

    useEffect(() => {
        if (postDetails.GigStatus === 'Available') {
            setDoneBtnVisible(false);
            setAvailBtnVisible(false);
            setCloseBtnVisible(true);
            setOnGoingBtnVisible(false);
            setCancelBtnVisible(true);
        } else if (postDetails.GigStatus === 'On-going') {
            setDoneBtnVisible(true);
            setAvailBtnVisible(false);
            setOnGoingBtnVisible(false);
            setCancelBtnVisible(false);
            setCloseBtnVisible(false);
        } else if (postDetails.GigStatus === 'Close') {
            setAvailBtnVisible(true);
            setCloseBtnVisible(false);
            setDoneBtnVisible(false);
            setOnGoingBtnVisible(true);
        } else if (postDetails.GigStatus === 'Cancel') {
            setCloseBtnVisible(false);
            setOnGoingBtnVisible(false);
            setDoneBtnVisible(false);
            setCancelBtnVisible(false);
            setAvailBtnVisible(false);
        } else if (postDetails.GigStatus === 'Done') {
            setCloseBtnVisible(false);
            setOnGoingBtnVisible(false);
            setDoneBtnVisible(false);
            setCancelBtnVisible(false);
            setAvailBtnVisible(false);
        }
    }, [counter])


    const handleCloseStatus = () => {
        const dbRefUser = ref(db, 'gigPosts/' + postID)
        const dbRef = ref(db, 'users/client/' + uid + '/gigs/' + postID);

        update(dbRefUser, {
            gigStatus: 'Close'
        })

        update(dbRef, {
            gigStatus: 'Close'
        })
        setGigModal(false)
    }


    const handleBanPoints = () => {
        const currentDate = new Date();
        const firstScheduledDate = new Date(schedule[0].date);
        const timeDifference = firstScheduledDate.getTime() - currentDate.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

        if (daysDifference <= 3) {
            // Show the confirmation modal
            // setShowConfirmationModal(true);
            // Client is trying to cancel within 3 days of the first scheduled date
            const banningPoints = userData.banningPoints || 0; // Get current banning points from the database
            if (banningPoints < 3) {
                // Increment banning points
                const updatedBanningPoints = banningPoints + 1;
                // Update banning points in the database
                const userRef = ref(db, 'users/client/' + uid);
                update(userRef, {
                    banningPoints: updatedBanningPoints
                });
                if (updatedBanningPoints === 3) {
                    // Ban the account
                    update(userRef, {
                        isBanned: true
                    });
                }
            }
        } else {
            // Client is canceling the gig with more than 3 days difference
            // Implement normal cancellation logic here
        }

    }



    const handleCancelStatus = () => {
        const dbRefUser = ref(db, 'gigPosts/' + postID);
        const dbRef = ref(db, 'users/client/' + uid + '/gigs/' + postID);
        const userRef = ref(db, 'users/client/' + uid);
        const userClient = ref(db, 'users/logged_users/' + uid);

        // Show confirmation modal and handle ban points
        setShowConfirmationModal(true);
        handleBanPoints();
        // Start a transaction to increment gigsCancelled value atomically for userRef
        runTransaction(userClient, (userData) => {
            // Ensure userData is defined and has the 'gigsCancelled' property
            if (!userData || userData.gigsCancelled === undefined || userData.gigsCancelled === null) {
                userData = { ...userData, gigsCancelled: 1 }; // Initialize data if it doesn't exist
            } else {
                // Create a new object and copy existing properties
                userData = { ...userData, gigsCancelled: userData.gigsCancelled + 1 };
                // Alternatively, you can use Object.assign():
                // userData = Object.assign({}, userData, { gigsCompleted: userData.gigsCompleted + 1 });
            }
            return userData;
        }).then(() => {
            console.log('Successfully updated gigsCancelled');
        }).catch((error) => {
            console.error('Error updating gigsCancelled for userRef:', error);
            // Handle the error here, such as showing an error message to the user
        });

        // Start a transaction to increment gigsCancelled value atomically for userRef
        runTransaction(userRef, (userData) => {
            // Ensure userData is defined and has the 'gigsCancelled' property
            if (!userData || userData.gigsCancelled === undefined || userData.gigsCancelled === null) {
                userData = { ...userData, gigsCancelled: 1 }; // Initialize data if it doesn't exist
            } else {
                // Create a new object and copy existing properties
                userData = { ...userData, gigsCancelled: userData.gigsCancelled + 1 };
                // Alternatively, you can use Object.assign():
                // userData = Object.assign({}, userData, { gigsCompleted: userData.gigsCompleted + 1 });
            }
            return userData;
        }).then(() => {
            // Update gigStatus in gigPosts and gigs nodes for userRef
            update(dbRefUser, {
                gigStatus: 'Cancel'
            });

            update(dbRef, {
                gigStatus: 'Cancel'
            });

            // Close gig modal
            setGigModal(false);
        }).catch((error) => {
            console.error('Error updating gigsCancelled for userRef:', error);
            // Handle the error here, such as showing an error message to the user
        });
    };

    const handleOngoingStatus = () => {
        const dbRefUser = ref(db, 'gigPosts/' + postID)
        const dbRef = ref(db, 'users/client/' + uid + '/gigs/' + postID);

        update(dbRefUser, {
            gigStatus: 'On-going'
        })
        update(dbRef, {
            gigStatus: 'On-going'
        })
        setGigModal(false)
    }



    const handleDoneStatus = () => {
        const dbRefUser = ref(db, 'gigPosts/' + postID);
        const dbRef = ref(db, 'users/client/' + uid + '/gigs/' + postID);
        const userRef = ref(db, 'users/logged_users/' + uid);

        // Iterate through acceptedUserKeys array
        acceptedUserKeys.forEach((userKey) => {
            const musicianRef = ref(db, 'users/logged_users/' + userKey);

            // Start a transaction to increment gigsCompleted value atomically for musicianRef
            // Inside the runTransaction callback for musicianRef
            runTransaction(musicianRef, (musicianData) => {
                // Ensure musicianData is defined and has the 'gigsCompleted' property
                if (!musicianData || musicianData.gigsCompleted === undefined || musicianData.gigsCompleted === null) {
                    musicianData = { ...musicianData, gigsCompleted: 1 }; // Initialize data if it doesn't exist
                } else {
                    // Create a new object and copy existing properties
                    musicianData = { ...musicianData, gigsCompleted: musicianData.gigsCompleted + 1 };
                    // Alternatively, you can use Object.assign():
                    // musicianData = Object.assign({}, musicianData, { gigsCompleted: musicianData.gigsCompleted + 1 });
                }
                return musicianData;
            }).then(() => {
                console.log('Successfully updated gigsCompleted for musician with key:', userKey);
            }).catch((error) => {
                console.error('Error updating gigsCompleted for musician with key:', userKey, error);
                // Handle the error here, such as showing an error message to the user
            });
        });

        // Start a transaction to increment gigsCompleted value atomically for userRef
        runTransaction(userRef, (userData) => {
            // Ensure userData is defined and has the 'gigsCompleted' property
            if (!userData || userData.gigsCompleted === undefined || userData.gigsCompleted === null) {
                userData = { ...userData, gigsCompleted: 1 }; // Initialize data if it doesn't exist
            } else {
                // Create a new object and copy existing properties
                userData = { ...userData, gigsCompleted: userData.gigsCompleted + 1 };
                // Alternatively, you can use Object.assign():
                // userData = Object.assign({}, userData, { gigsCompleted: userData.gigsCompleted + 1 });
            }
            return userData;
        }).then(() => {
            // Update gigStatus in gigPosts and gigs nodes for userRef
            update(dbRefUser, {
                gigStatus: 'Done'
            });

            update(dbRef, {
                gigStatus: 'Done'
            });

            // Close gig modal
            setGigModal(false);
        }).catch((error) => {
            console.error('Error updating gigsCompleted for userRef:', error);
            // Handle the error here, such as showing an error message to the user
        });
    };


    const handleAvailableStatus = () => {
        const dbRefUser = ref(db, 'gigPosts/' + postID)
        const dbRef = ref(db, 'users/client/' + uid + '/gigs/' + postID);

        update(dbRefUser, {
            gigStatus: 'Available'
        })

        update(dbRef, {
            gigStatus: 'Available'
        })

        setGigModal(false)

    }




    //replace the comment with attribute ratings
    //attribute rating will be calculated by average and becomes the overall rating of the musician
    //musician rating will be calculated by average from the individual organizers
    //musician rating will determine the ranking of the recommended musicians in the organizer's main UI 
    //possible to integrate the musician's average rating the matchmaking calculation


    return (
        <View style={styles.root}>
            <View style={styles.imgContainer}>
                <ImageBackground source={{ uri: postDetails.GigImage }} style={styles.imgStyle}></ImageBackground>
            </View>

            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.detailContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleStyle}>{postDetails.GigName}</Text>
                    </View>

                    <View style={{ paddingHorizontal: 25, flexDirection: 'row' }}>
                        <TouchableOpacity style={{
                            padding: 5,
                            width: '14%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                            backgroundColor: '#c5ebe0'
                        }} onPress={() => handleGigModal()}>
                            <AntDesign name="bars" size={24} color='#0EB080' />
                        </TouchableOpacity>

                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 15
                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#0EB080' }}>{postDetails.GigStatus}</Text>
                        </View>

                    </View>

                    <Modal
                        visible={gigModal}
                        transparent={true}
                        animationType='slide'

                    >
                        <View style={{
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <View style={styles.gigStatusModal}>
                                <View>
                                    <Text>Change Gig Status</Text>
                                </View>

                                <View style={styles.gigStatusContainer}>
                                    {availBtnVisible ? (
                                        <TouchableOpacity style={{ ...styles.gigStatusBtn, backgroundColor: '#0EB080' }}
                                            onPress={() => handleAvailableStatus()}>
                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
                                                Available
                                            </Text>

                                        </TouchableOpacity>

                                    ) : closeBtnVisible ? (

                                        <TouchableOpacity style={{ ...styles.gigStatusBtn, backgroundColor: 'gray' }}
                                            onPress={() => handleCloseStatus()}>
                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
                                                Close
                                            </Text>
                                        </TouchableOpacity>
                                    ) : <></>}
                                    {cancelBtnVisible ? (
                                        <TouchableOpacity style={{ ...styles.gigStatusBtn, backgroundColor: 'red' }}
                                            onPress={() => handleCancelStatus()}>
                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
                                                Cancel
                                            </Text>
                                        </TouchableOpacity>
                                    ) : null}
                                    {onGoingBtnVisible ? (
                                        <TouchableOpacity style={{ ...styles.gigStatusBtn, backgroundColor: '#FABF35' }}
                                            onPress={() => handleOngoingStatus()}>
                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
                                                On-going
                                            </Text>
                                        </TouchableOpacity>
                                    ) : null}
                                    {doneBtnVisible ? (
                                        <TouchableOpacity style={{ ...styles.gigStatusBtn, backgroundColor: '#0EB080' }}
                                            onPress={() => handleDoneStatus()}>
                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
                                                Done
                                            </Text>
                                        </TouchableOpacity>
                                    ) : null}
                                </View>


                                <TouchableOpacity onPress={() => setGigModal(false)}>
                                    <AntDesign name="closecircle" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <View style={styles.AddressContainer}>
                        {schedule.map((sched, index) => (
                            <TouchableOpacity style={styles.schedItem} onPress={() => handleSet(index)}>
                                <Text style={{ fontSize: 20, fontWeight: '500' }}>Set</Text>
                                <View key={index} style={{
                                    backgroundColor: '#F0F0F0',
                                    height: 45,
                                    width: 45,
                                    borderRadius: 25,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 10
                                }}>
                                    <Text style={{ fontSize: 20, color: '#0EB080', fontWeight: 'bold' }}>{index + 1}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}


                    </View>

                    <Modal visible={visible} animationType='slide' transparent>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={{ fontWeight: 'bold' }}>Schedule and Location</Text>
                                {visible ? (
                                    <View style={styles.modalDetails}>
                                        <View style={{ marginTop: 15 }}>
                                            <Text>Date:</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <MaterialIcons name="date-range" size={24} color="black" />
                                                <Text>{date[selectedIndex]}</Text>

                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                                            <View>
                                                <Text>Time Start:</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Feather name="clock" size={24} color="black" />
                                                    <Text>{start[selectedIndex]}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text>Time End:</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Feather name="clock" size={24} color="black" />
                                                    <Text>{end[selectedIndex]}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <Text>Address:</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Ionicons name="location-outline" size={24} color="black" />
                                                <Text>{address[selectedIndex]}</Text>
                                            </View>
                                        </View>

                                        <TouchableOpacity onPress={() => handleCloseSet()} style={styles.closeSetBtn}>
                                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 15 }}>Close</Text>
                                        </TouchableOpacity>



                                    </View>
                                ) : null
                                }

                            </View>
                        </View>
                    </Modal>

                    <View style={styles.InstContainer}>
                        <View style={styles.instrumentStyle}>
                            {instruments.map((instrument, index) => (
                                <View key={index} style={styles.chip}>
                                    <Text style={styles.instTxt}>{instrument.quantity}</Text>
                                    <Text style={styles.instTxt}>{instrument.name}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.genreStyle}>
                            {genre.map((genres, index) => (
                                <Text style={[styles.chip, styles.genreTxt]} key={index}>{genres}</Text>
                            ))}
                        </View>
                    </View>

                    <View style={styles.organizerContainer}>
                        <View style={styles.organizerPhotoContainer}>
                            <ImageBackground style={{ height: '100%', width: '100%' }} source={{ uri: userData.profilePic }}>

                            </ImageBackground>
                        </View>
                        <View style={styles.organizerTxtContainer}>
                            <Text>{userData.firstName} {userData.lastName}</Text>
                            <Text style={{ color: '#706E8F', fontSize: 10 }}>Organizer</Text>
                        </View>
                    </View>

                    <View style={styles.aboutContainer}>
                        <View style={styles.aboutTitle}>
                            <Text style={{ fontWeight: 'bold' }}>About Event</Text>
                        </View>

                        <View style={styles.aboutContent}>
                            <Text style={{ fontSize: 11 }}>{postDetails.about}</Text>
                        </View>


                    </View>


                </View>

                <View style={styles.appliedContainer}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Applied Users:</Text>
                    <FlatList
                        data={matchedMusicians}
                        horizontal={true}
                        renderItem={renderApplied}
                        keyExtractor={(item) => item.key}
                        ItemSeparatorComponent={renderSeparator}
                    />
                </View>
            </ScrollView>


            <View style={styles.btnContainer}>
                <Button mode='elevated'
                    onPress={() => archiveGig()}
                    loading={loading}
                    buttonColor='#0EB080'
                    textColor='white'
                    style={styles.btnStyle}>
                    {archived ? (<Text>Gig Archived</Text>) : (<Text>Archive Gig</Text>)}
                </Button>
            </View>


            <Modal
                animationType='slide'
                visible={modalVisible}
                onRequestClose={hideGigModal}
            >



                <View>
                    <AppliedProfile {...props} hideModal={handleHide} />
                </View>

            </Modal>


            <Modal
                animationType='slide'
                transparent={true}
                visible={acceptedVisible}
            >

                <View style={styles.acceptedContainer}>

                    <View style={styles.acceptedBorder}>
                        <View style={styles.ratingTitle}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Musicians Involved</Text>
                        </View>
                        <ScrollView contentContainerStyle={styles.scrollViewContent}>
                            {acceptedUsers.map((users, index) => (
                                <TouchableOpacity
                                    key={index.toString()}
                                    style={[
                                        styles.acceptedListContainer,
                                        // Add conditional styling to mark the selected user
                                        selectedUserKey === users.key ? styles.selectedUser : null,
                                    ]}
                                    onPress={() => handleUserPress(users.key)}>

                                    <View style={styles.acceptedPicContainer}>
                                        <ImageBackground source={{ uri: users.profilePic }} style={{ height: '100%', width: '100%' }}>
                                        </ImageBackground>
                                    </View>


                                    <View style={styles.txtContainer}>
                                        <Text>{users.firstName} {users.lastName}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View style={styles.btnContainer}>
                            <TouchableOpacity style={styles.doneBtn} onPress={() => hideAccepted()}>
                                <Text style={styles.btnTxtStyle}>Done!</Text>
                            </TouchableOpacity>

                        </View>

                    </View>



                </View>

            </Modal>

            <View style={{ bottom: screenHeight / 3, zIndex: 20 }} >
                {selectedUserKey && ratingsVisible && acceptedUsers.some((user) => user.key === selectedUserKey) && (
                    <View style={styles.ratingsContainer}>
                        <View style={styles.ratingBorder}>

                            <View style={styles.ratingTitle}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Ratings and Feedbacks</Text>
                            </View>

                            <View style={styles.ratingTitle}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Appropriateness</Text>
                            </View>

                            {/* Add the rating component here */}
                            <AirbnbRating
                                reviews={["Poor", "Fair", "Good", "Very Good", "Excellent"]}
                                count={5}
                                defaultRating={3}
                                showRating={true}
                                size={20}
                                onFinishRating={(rating) => setRating(rating)}
                            />

                            <View style={styles.ratingTitle}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Punctuality</Text>
                            </View>

                            <AirbnbRating
                                reviews={["Poor", "Fair", "Good", "Very Good", "Excellent"]}
                                count={5}
                                defaultRating={3}
                                showRating={true}
                                size={20}
                                onFinishRating={(rating) => setRatingTwo(rating)}
                            />

                            <View style={styles.ratingTitle}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Skills</Text>
                            </View>


                            <AirbnbRating
                                reviews={["Poor", "Fair", "Good", "Very Good", "Excellent"]}
                                count={5}
                                defaultRating={3}
                                showRating={true}
                                size={20}
                                onFinishRating={(rating) => setRatingThree(rating)}
                            />

                            {/* Add the review input component here */}
                            <View style={styles.ratingTitles}>
                                <Text>Please share your opinion about the musician</Text>
                            </View>
                            <View style={styles.reviewContainer}>
                                <TextInput
                                    style={styles.reviewInput}
                                    multiline={true}
                                    autoCapitalize='sentences'
                                    blurOnSubmit={true}
                                    placeholder='Type your reviews...'
                                    value={review}
                                    onChangeText={(text) => setReview(text)}
                                />
                            </View>

                            {/* Add the submit button for the rating and review */}
                            <View style={styles.reviewBtnContainer}>
                                <TouchableOpacity style={styles.btnReview} onPress={() => handleRatingSubmission(selectedUserKey)}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Submit Review</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showConfirmationModal}
                onRequestClose={() => {
                    setShowConfirmationModal(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>
                            Canceling this gig within 3 days of the first scheduled date may lead to account suspension.
                            Are you sure you want to proceed?
                        </Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                // Client confirmed the cancellation, implement the logic to update banning points and ban account
                                // ...
                                setShowConfirmationModal(false);
                            }}
                        >
                            <Text style={styles.buttonText}>Yes, Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                // Client canceled the cancellation, do nothing or handle accordingly
                                // ...
                                setShowConfirmationModal(false);
                            }}
                        >
                            <Text style={styles.buttonText}>No, Keep Gig</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

export default ClientGigDetails

const styles = StyleSheet.create({
    nameContainer: {
        height: '100%',
        justifyContent: 'space-between',
        padding: 8,
        flexDirection: 'row',
    },
    nameStyle: {
        color: 'white',
        fontWeight: 'bold'
    },
    textContainer: {
        justifyContent: 'center',
        height: '30%',
    },
    imgContainers: {
        height: '70%',
        width: '100%',
    },
    renderContainer: {
        height: '100%',
        width: 200,
        backgroundColor: 'black',
        borderRadius: 15,
        overflow: 'hidden'
    },
    gigStatusContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gigStatusBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        padding: 15,
        marginBottom: 20,
        borderRadius: 23
    },
    gigStatusModal: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '70%',
        height: '60%'
    },
    closeSetBtn: {
        alignSelf: 'center',
        backgroundColor: '#0EB080',
        width: '70%',
        height: '15%',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    modalDetails: {
        height: '100%',
        width: '100%'
    },
    modalContent: {
        borderColor: '#0EB080',
        borderRadius: 15,
        backgroundColor: 'white',
        height: '35%',
        width: '80%',
        borderWidth: 2,
        elevation: 5,
        alignItems: 'center',
        padding: 20,

    },
    modalContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    schedItem: {
        borderWidth: 2,
        borderColor: '#0EB080',
        marginRight: 20,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        width: '25%',
        height: '60%'
    },
    doneBtn: {
        width: '60%',
        backgroundColor: '#0EB080',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    selectedUser: {
        borderColor: '#0EB080',
        borderWidth: 2
    },
    acceptedListContainer: {
        borderWidth: 0.5,
        flexDirection: 'row',
        height: 95,
        padding: 10,
        marginBottom: 10,

    },
    acceptedPicContainer: {
        width: '25%',
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: '#0EB080'
    },
    txtContainer: {
        marginLeft: 10
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 450,
    },
    acceptedBorder: {
        borderWidth: 0.5,
        height: '50%',
        width: '90%',
        backgroundColor: '#F9F9F9',
        borderRadius: 15,
    },
    acceptedContainer: {
        padding: 10,
        marginTop: 10,
        height: '95%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnReview: {
        backgroundColor: '#0EB080',
        padding: 10,
        paddingHorizontal: 50,
        borderRadius: 15
    },
    reviewBtnContainer: {
        alignItems: 'center',
        marginTop: 30
    },
    reviewInput: {
        backgroundColor: '#D9D9D9',
        height: '100%',
        width: '100%',
        borderRadius: 10,
        padding: 10
    },
    reviewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginTop: 10,
        height: '20%'
    },
    ratingTitles: {
        borderColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginTop: 25
    },
    ratingTitle: {
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    ratingBorder: {
        borderWidth: 0.5,
        height: '100%',
        width: '100%',
        backgroundColor: '#F9F9F9',
        borderRadius: 15
    },
    ratingsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: screenHeight,
        width: screenWidth
    },
    appBarStyle: {
        backgroundColor: '#151414',
        justifyContent: 'space-between'
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 450,
    },
    appliedContainer: {
        padding: 15,
        top: screenHeight / 6,
        height: '30%'
    },
    appliedUserContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'space-between'
    },
    userProfilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userName: {
        fontWeight: 'bold',
    },
    aboutContent: {
        textAlign: 'center'
    },
    aboutTitle: {
        marginBottom: 10
    },
    aboutContainer: {
        padding: 15,
        borderWidth: 2
    },
    organizerTxtContainer: {
        justifyContent: 'center',
        marginLeft: 7
    },
    organizerPhotoContainer: {
        height: 60,
        width: '18%',
        borderRadius: 100,
        overflow: 'hidden'
    },
    organizerContainer: {
        flexDirection: 'row',
        padding: 10,
    },
    scrollContainer: {
        flex: 1,
    },
    InstContainer: {
        marginTop: 10
    },
    instTxt: {
        fontSize: 10
    },
    genreTxt: {
        fontSize: 10
    },
    genreStyle: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    instrumentStyle: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'

    },
    chip: {
        borderWidth: 2,
        borderColor: '#0EB080',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15

    },
    btnTxtStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    btnStyle: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,

    },
    btnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 20
    },
    AddressTxt: {
        fontWeight: 'bold',
        fontSize: 13
    },
    LocationContainer: {
        justifyContent: 'center',
        marginLeft: 10,

    },
    AddressContainer: {
        flexDirection: 'row',
        paddingLeft: 25,
        alignItems: 'center',
    },
    dateTxt: {
        fontWeight: 'bold',
        fontSize: 13
    },
    timeTxt: {
        color: '#747688',
        fontSize: 12
    },
    dateContainer: {
        justifyContent: 'center',
        marginLeft: 10
    },
    dateTimeContainer: {
        flexDirection: 'row',
        paddingLeft: 25,
        alignItems: 'center',

    },
    root: {
        height: screenHeight,
        width: screenWidth,
        flex: 1
    },
    detailContainer: {
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        height: '100%',
        zIndex: 2,
        top: -15,
        backgroundColor: 'white',
    },
    imgContainer: {
        height: '25%',
        width: '100%',
    },
    imgStyle: {
        width: '100%',
        height: '100%',
    },
    titleContainer: {
        justifyContent: 'center',
        textAlign: 'left',
        padding: 25
    },
    titleStyle: {
        color: "#0EB080",
        fontWeight: 'bold',
        fontSize: 20,
    }
})