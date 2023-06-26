import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Animated } from 'react-native'
import React, { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { auth, db } from '../../firebase';
import { ref as ref_db, set, push, child, onValue, DataSnapshot } from 'firebase/database';
import { useEffect } from 'react';




const { height: screenHeight } = Dimensions.get('screen');
const { width: screenWidth } = Dimensions.get('screen');



const GenreInst = ({ gigName, gigAddress, gigDate, StartTime, EndTime, eventType, img }) => {

    const [selectedInstruments, setSelectedInstruments] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const ContentValue = useState(new Animated.Value(-600))[0]
    const [isClicked, SetIsClicked] = useState(false);
    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const user = auth.currentUser;
    const uid = user.uid;



    //getting the First and Last name
    useEffect(() => {
        const FirstName = ref_db(db, 'users/' + user.uid + '/first_name');
        onValue(FirstName, (DataSnapshot) => {
            setFname(DataSnapshot.val())
        });

        const LastName = ref_db(db, 'users/' + user.uid + '/lname');
        onValue(LastName, (DataSnapshot) => {
            setLname(DataSnapshot.val())
        });
        // console.log(img);
    })



    const handleInstrumentsClick = (buttonId) => {
        const isInstrumentSelected = selectedInstruments.includes(buttonId);

        if (isInstrumentSelected) {
            //Remove the button from the selected instruments array
            setSelectedInstruments(selectedInstruments.filter((id) => id !== buttonId));
        } else {
            //Add the button to the selected buttons array
            setSelectedInstruments([...selectedInstruments, buttonId]);

        }
    }



    //handles gig creation
    //add gig details at the same time in PostGigs and UserGigs
    const handleCreateGig = () => {

        //Generates GigPost Key
        const newGigsRefKey = push(child(ref_db(db), 'gigs')).key;
        const UserGigsRef = ref_db(db, 'users/' + '/client/' + uid + '/gigs/' + newGigsRefKey);
        const GigPostsRef = ref_db(db, 'gigPosts/' + '/' + newGigsRefKey);

        set(UserGigsRef, {
            Organizer: fname + lname,
            uid: uid,
            Gig_Name: gigName,
            Gig_Address: gigAddress,
            Gig_Date: gigDate,
            Gig_Start: StartTime,
            Gig_End: EndTime,
            Event_Type: eventType,
            Instruments_Needed: { ...selectedInstruments },
            Genre_Needed: { ...selectedGenres },
            postID: newGigsRefKey,
            Gig_Image: img,
        });


        set(GigPostsRef, {
            Organizer: fname + lname,
            uid: uid,
            Gig_Name: gigName,
            Gig_Address: gigAddress,
            Gig_Date: gigDate,
            Gig_Start: StartTime,
            Gig_End: EndTime,
            Event_Type: eventType,
            Instruments_Needed: { ...selectedInstruments },
            Genre_Needed: { ...selectedGenres },
            postID: newGigsRefKey,
            Gig_Image: img,
        });


    }




    const handleGenresClick = (GenreId) => {
        const isGenreSelected = selectedGenres.includes(GenreId);

        if (isGenreSelected) {
            //Remove the button from the selected instruments array
            setSelectedGenres(selectedGenres.filter((id) => id !== GenreId));
        } else {
            //Add the button to the selected buttons array
            setSelectedGenres([...selectedGenres, GenreId]);

        }
    }





    const handleClick = () => {
        Animated.timing(ContentValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start()
        SetIsClicked(true);

    }



    return (

        <View style={styles.container}>
            {isClicked ? (
                <Animated.View
                    style={{ right: ContentValue }}>
                    {isClicked ? (
                        <>
                            <View style={styles.headerContainer}>
                                <Text style={styles.header}>Choose <Text style={{ color: '#0EB080' }}>Genre</Text></Text>
                                <Text style={styles.subheaderTxt}>Select your preferred music genre for the Gig</Text>
                            </View>

                            <View style={styles.btnContainer}>

                                <View style={styles.row}>
                                    <View style={styles.column}>
                                        <TouchableOpacity
                                            style={[
                                                styles.btnStyle,
                                                selectedGenres.includes("Worship Pop") ? styles.selectedButton : null,
                                            ]}
                                            onPress={() => handleGenresClick("Worship Pop")}>

                                            <Entypo name="vinyl" size={24} color="black" />
                                            <Text>Worship Pop</Text>

                                        </TouchableOpacity>

                                    </View>

                                    <View style={styles.column}>
                                        <TouchableOpacity
                                            style={[
                                                styles.btnStyle,
                                                selectedGenres.includes("Christian Rock") ? styles.selectedButton : null,
                                            ]}
                                            onPress={() => handleGenresClick("Christian Rock")}>

                                            <Entypo name="vinyl" size={24} color="black" />
                                            <Text>Christian Rock</Text>

                                        </TouchableOpacity>

                                    </View>

                                    <View style={styles.column}>
                                        <TouchableOpacity
                                            style={[
                                                styles.btnStyle,
                                                selectedGenres.includes("Country") ? styles.selectedButton : null,
                                            ]}
                                            onPress={() => handleGenresClick("Country")}>

                                            <Entypo name="vinyl" size={24} color="black" />
                                            <Text>Country</Text>

                                        </TouchableOpacity>

                                    </View>

                                </View>

                                <View style={styles.row}>
                                    <View style={styles.column}>
                                        <TouchableOpacity
                                            style={[
                                                styles.btnStyle,
                                                selectedGenres.includes("Christian Jazz") ? styles.selectedButton : null,
                                            ]}
                                            onPress={() => handleGenresClick("Christian Jazz")}>

                                            <Entypo name="vinyl" size={24} color="black" />
                                            <Text>Christian Jazz</Text>

                                        </TouchableOpacity>

                                    </View>

                                    <View style={styles.column}>
                                        <TouchableOpacity
                                            style={[
                                                styles.btnStyle,
                                                selectedGenres.includes("Gospel Blues") ? styles.selectedButton : null,
                                            ]}
                                            onPress={() => handleGenresClick("Gospel Blues")}>

                                            <Entypo name="vinyl" size={24} color="black" />
                                            <Text>Gospel Blues</Text>

                                        </TouchableOpacity>

                                    </View>

                                    <View style={styles.column}>
                                        <TouchableOpacity
                                            style={[
                                                styles.btnStyle,
                                                selectedGenres.includes("Reggae") ? styles.selectedButton : null,
                                            ]}
                                            onPress={() => handleGenresClick("Reggae")}>

                                            <Entypo name="vinyl" size={24} color="black" />
                                            <Text>Reggae</Text>

                                        </TouchableOpacity>

                                    </View>


                                </View>

                                <View style={styles.row}>
                                    <View style={styles.column}>
                                        <TouchableOpacity
                                            style={[
                                                styles.btnStyle,
                                                selectedGenres.includes("Christian R&B") ? styles.selectedButton : null,
                                            ]}
                                            onPress={() => handleGenresClick("Christian R&B")}>

                                            <Entypo name="vinyl" size={24} color="black" />
                                            <Text>Christian R&B</Text>

                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.column}>
                                        <TouchableOpacity
                                            style={[
                                                styles.btnStyle,
                                                selectedGenres.includes("Electronic") ? styles.selectedButton : null,
                                            ]}
                                            onPress={() => handleGenresClick("Electronic")}>

                                            <Entypo name="vinyl" size={24} color="black" />
                                            <Text>Electronic</Text>

                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.column}>
                                        <TouchableOpacity
                                            style={[
                                                styles.btnStyle,
                                                selectedGenres.includes("Classical") ? styles.selectedButton : null,
                                            ]}
                                            onPress={() => handleGenresClick("Classical")}>

                                            <Entypo name="vinyl" size={24} color="black" />
                                            <Text>Classical</Text>

                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.BtnRow}>
                                    <TouchableOpacity onPress={handleCreateGig}>
                                        <View style={styles.button}>
                                            <Text style={styles.txtStyle}>Create Gig</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </>
                    ) : null}
                </Animated.View>
            ) : (

                <>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Choose <Text style={{ color: '#0EB080' }}>Instruments</Text></Text>
                        <Text style={styles.subheaderTxt}>Instruments needed for the Gig </Text>
                    </View>

                    <View style={styles.btnContainer}>

                        <View style={styles.row}>
                            <View style={styles.column}>
                                <TouchableOpacity
                                    style={[
                                        styles.btnStyle,
                                        selectedInstruments.includes("Guitar") ? styles.selectedButton : null,
                                    ]}
                                    onPress={() => handleInstrumentsClick("Guitar")}>

                                    <MaterialCommunityIcons name="guitar-pick-outline" size={24} color="black" />
                                    <Text>Guitar</Text>

                                </TouchableOpacity>

                            </View>

                            <View style={styles.column}>
                                <TouchableOpacity
                                    style={[
                                        styles.btnStyle,
                                        selectedInstruments.includes("Bass") ? styles.selectedButton : null,
                                    ]}
                                    onPress={() => handleInstrumentsClick("Bass")}>

                                    <MaterialCommunityIcons name="guitar-pick-outline" size={24} color="black" />
                                    <Text>Bass</Text>

                                </TouchableOpacity>

                            </View>

                            <View style={styles.column}>
                                <TouchableOpacity
                                    style={[
                                        styles.btnStyle,
                                        selectedInstruments.includes("Keyboard") ? styles.selectedButton : null,
                                    ]}
                                    onPress={() => handleInstrumentsClick("Keyboard")}>

                                    <MaterialCommunityIcons name="piano" size={24} color="black" />
                                    <Text>Keyboard</Text>

                                </TouchableOpacity>

                            </View>

                        </View>

                        <View style={styles.row}>
                            <View style={styles.column}>
                                <TouchableOpacity
                                    style={[
                                        styles.btnStyle,
                                        selectedInstruments.includes("Drums") ? styles.selectedButton : null,
                                    ]}
                                    onPress={() => handleInstrumentsClick("Drums")}>

                                    <FontAwesome5 name="drum" size={24} color="black" />
                                    <Text>Drums</Text>

                                </TouchableOpacity>

                            </View>

                            <View style={styles.column}>
                                <TouchableOpacity
                                    style={[
                                        styles.btnStyle,
                                        selectedInstruments.includes("Vocals") ? styles.selectedButton : null,
                                    ]}
                                    onPress={() => handleInstrumentsClick("Vocals")}>

                                    <Entypo name="modern-mic" size={24} color="black" />
                                    <Text>Vocals</Text>

                                </TouchableOpacity>

                            </View>

                            <View style={styles.column}>
                                <TouchableOpacity
                                    style={[
                                        styles.btnStyle,
                                        selectedInstruments.includes("Violin") ? styles.selectedButton : null,
                                    ]}
                                    onPress={() => handleInstrumentsClick("Violin")}>

                                    <MaterialCommunityIcons name="violin" size={24} color="black" />
                                    <Text>Violin</Text>

                                </TouchableOpacity>

                            </View>


                        </View>

                        <View style={styles.row}>
                            <View style={styles.column}>
                                <TouchableOpacity
                                    style={[
                                        styles.btnStyle,
                                        selectedInstruments.includes("Hand Drums") ? styles.selectedButton : null,
                                    ]}
                                    onPress={() => handleInstrumentsClick("Hand Drums")}>

                                    <MaterialCommunityIcons name="hand-back-left-outline" size={24} color="black" />
                                    <Text>Hand Drums</Text>

                                </TouchableOpacity>
                            </View>
                            <View style={styles.column}>
                                <TouchableOpacity
                                    style={[
                                        styles.btnStyle,
                                        selectedInstruments.includes("Saxophone") ? styles.selectedButton : null,
                                    ]}
                                    onPress={() => handleInstrumentsClick("Saxophone")}>

                                    <MaterialCommunityIcons name="saxophone" size={24} color="black" />
                                    <Text>Saxophone</Text>

                                </TouchableOpacity>
                            </View>
                            <View style={styles.column}>
                                <TouchableOpacity
                                    style={[
                                        styles.btnStyle,
                                        selectedInstruments.includes("Trumpet") ? styles.selectedButton : null,
                                    ]}
                                    onPress={() => handleInstrumentsClick("Trumpet")}>

                                    <MaterialCommunityIcons name="trumpet" size={24} color="black" />
                                    <Text>Trumpet</Text>

                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.BtnRow}>
                            <TouchableOpacity onPress={handleClick}>
                                <View style={styles.button}>
                                    <Text style={styles.txtStyle}>Next</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                </>
            )}
        </View >
    )
}

export default GenreInst

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        flex: 1
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 5
    },
    header: {
        fontWeight: 'bold',
        fontSize: 20
    },
    subheaderTxt: {
        marginVertical: 5
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
        width: '100%'
    },
    column: {
        flex: 1
    },
    btnContainer: {
        width: '100%',
        justifyContent: 'flex-start',
        height: screenHeight / 2
    },
    btnStyle: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#0EB080',
        borderRadius: 10,
        marginHorizontal: 10,
        paddingVertical: 20,
    },
    button: {
        borderWidth: 1,
        borderColor: '#0EB080',
        backgroundColor: '#0EB080',
        width: screenWidth / 1.5,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 10
    },
    BtnRow: {
        alignItems: 'center',
        marginTop: 8,
        width: screenWidth,
    },
    txtStyle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white'
    },
    selectedButton: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#0EB080',
        borderRadius: 10,
        marginHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: '#0EB080',
    }
})