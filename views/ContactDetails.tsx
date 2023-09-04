import * as React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Header, Icon } from 'react-native-elements';
import Screen from '../components/Screen';

import LightningBolt from '../assets/images/SVG/Lightning Bolt.svg';
import BitcoinIcon from '../assets/images/SVG/BitcoinIcon.svg';
import KeySecurity from '../assets/images/SVG/Key Security.svg';
import VerifiedAccount from '../assets/images/SVG/Verified Account.svg';
import EditContact from '../assets/images/SVG/Pen.svg';

import { themeColor } from '../utils/ThemeUtils';

interface ContactDetailsProps {
    navigation: any;
}

interface ContactItem {
    lnAddress: string;
    onchainAddress: string;
    nip05: string;
    nostrNpub: string;
    name: string;
    description: string;
    photo: string | null;
    isFavourite: boolean;
    id: string;
}
interface ContactDetailsState {
    contact: ContactItem;
}
export default class ContactDetails extends React.Component<
    ContactDetailsProps,
    ContactDetailsState
> {
    constructor(props: ContactDetailsProps) {
        super(props);
        const contact: ContactItem = this.props.navigation.getParam(
            'contact',
            null
        );

        this.state = {
            contact
        };
    }
    sendAddress = (address: string) => {
        const { navigation } = this.props;
        const { contact } = this.state;
        navigation.navigate('Send', {
            destination: address,
            contactName: contact.name
        });
    };
    saveUpdatedContact = async (updatedContact: ContactItem) => {
        try {
            const contactsString = await EncryptedStorage.getItem(
                'zeus-contacts'
            );

            if (contactsString) {
                const existingContacts: ContactItem[] =
                    JSON.parse(contactsString);

                // Find the index of the contact with the same name
                const contactIndex = existingContacts.findIndex(
                    (contact) => contact.id === updatedContact.id
                );

                if (contactIndex !== -1) {
                    // Update the contact in the array
                    existingContacts[contactIndex] = updatedContact;

                    // Save the updated contacts back to storage
                    await EncryptedStorage.setItem(
                        'zeus-contacts',
                        JSON.stringify(existingContacts)
                    );

                    console.log('Contact updated successfully!');
                }
            }
        } catch (error) {
            console.log('Error updating contact:', error);
        }
    };
    toggleFavorite = () => {
        const { contact } = this.state;

        // Toggle the isFavourite field
        const updatedContact = {
            ...contact,
            isFavourite: !contact.isFavourite
        };

        // Save the updated contact
        this.saveUpdatedContact(updatedContact);

        // Update the state to reflect the changes
        this.setState({ contact: updatedContact });
    };

    render() {
        const { contact } = this.state;
        const { navigation } = this.props;
        const BackButton = () => (
            <Icon
                name="arrow-back"
                onPress={() => {
                    navigation.goBack();
                }}
                color={themeColor('text')}
                underlayColor="transparent"
            />
        );
        const StarButton = () => (
            <Icon
                name={contact.isFavourite ? 'star' : 'star-outline'}
                onPress={this.toggleFavorite}
                color={themeColor('text')}
                underlayColor="transparent"
                size={28}
            />
        );
        const EditContactButton = () => (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('AddContacts', {
                        prefillContact: contact,
                        isEdit: true
                    })
                }
            >
                <EditContact height={36} width={36} />
            </TouchableOpacity>
        );
        return (
            <Screen>
                <Header
                    leftComponent={<BackButton />}
                    centerComponent={<EditContactButton />}
                    rightComponent={<StarButton />}
                    centerContainerStyle={{ paddingRight: 6, marginTop: -3 }}
                    placement="right"
                    backgroundColor="none"
                    containerStyle={{
                        borderBottomWidth: 0
                    }}
                />
                <View
                    style={{
                        backgroundColor: 'none',
                        alignItems: 'center',
                        marginTop: 60
                    }}
                >
                    {contact.photo && (
                        <Image
                            source={{ uri: contact.photo }}
                            style={{
                                width: 150,
                                height: 150,
                                borderRadius: 75,
                                marginBottom: 20
                            }}
                        />
                    )}
                    <Text
                        style={{
                            fontSize: 44,
                            fontWeight: 'bold',
                            marginBottom: 10,
                            color: 'white'
                        }}
                    >
                        {contact.name}
                    </Text>
                    <Text
                        style={{
                            fontSize: 20,
                            marginBottom: 6,
                            color: themeColor('secondaryText')
                        }}
                    >
                        {contact.description}
                    </Text>
                    {contact.lnAddress.length > 0 && (
                        <View>
                            {contact.lnAddress.map((address, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => this.sendAddress(address)}
                                >
                                    <View style={styles.contactRow}>
                                        <LightningBolt />
                                        <Text style={styles.contactFields}>
                                            {address.length > 15
                                                ? `${address.substring(
                                                      0,
                                                      10
                                                  )}...${address.substring(
                                                      address.length - 5
                                                  )}`
                                                : address}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {contact.onchainAddress.length > 0 && (
                        <View>
                            {contact.onchainAddress.map((address, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => this.sendAddress(address)}
                                >
                                    <View key={index} style={styles.contactRow}>
                                        <BitcoinIcon />
                                        <Text style={styles.contactFields}>
                                            {address.length > 15
                                                ? `${address.substring(
                                                      0,
                                                      10
                                                  )}...${address.substring(
                                                      address.length - 5
                                                  )}`
                                                : address}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    {contact.nip05.length > 0 && (
                        <View>
                            {contact.nip05.map((value, index) => (
                                <View key={index} style={styles.contactRow}>
                                    <VerifiedAccount />
                                    <Text style={styles.contactFields}>
                                        {value.length > 15
                                            ? `${value.substring(
                                                  0,
                                                  10
                                              )}...${value.substring(
                                                  value.length - 5
                                              )}`
                                            : value}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                    {contact.nostrNpub.length > 0 && (
                        <View>
                            {contact.nostrNpub.map((value, index) => (
                                <View key={index} style={styles.contactRow}>
                                    <View>
                                        <KeySecurity />
                                    </View>
                                    <Text style={styles.contactFields}>
                                        {value.length > 15
                                            ? `${value.substring(
                                                  0,
                                                  10
                                              )}...${value.substring(
                                                  value.length - 5
                                              )}`
                                            : value}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </Screen>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Lato-Regular'
    },
    button: {
        paddingTop: 10,
        paddingBottom: 10
    },
    contactRow: {
        flexDirection: 'row',
        marginRight: 10,
        alignItems: 'center'
    },
    contactFields: {
        fontSize: 20,
        marginBottom: 4,
        marginLeft: 4,
        color: themeColor('chain')
    }
});
