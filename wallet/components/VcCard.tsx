import { View, Text, StyleSheet, Pressable } from "react-native"
import { Image } from "expo-image"

interface VcCardProps {
    vc: any,
    onVcPress: (vc: any) => void,
}

export default function VcCard({ vc, onVcPress }: VcCardProps) {
    const blurhash =
        '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


    return (
        <Pressable
            onPress={() => onVcPress(vc)}
            style={({ pressed }) => [
                {
                    backgroundColor: pressed
                        ? 'rgb(112, 112, 112)'
                        : '#333'
                },
                styles.container
            ]}
        >
            <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                    <Image
                        style={styles.image}
                        source={vc.issuer.imgUrl}
                        placeholder={{ blurhash }}
                        contentFit="cover"
                        transition={1000}
                    />

                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.vcTitle}>
                            {vc.credentialSubject.title}
                        </Text>
                        <Text style={styles.text}>
                            {vc.credentialSubject.name}
                        </Text>
                        <Text style={styles.text}>
                            {vc.issuer.name}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <Text style={styles.text}>
                        <Text style={{ fontWeight: "bold" }}>
                            Issuer: {" "}
                        </Text>
                        {vc.issuer.url}
                    </Text>
                    <Text style={styles.text}>
                        <Text style={{ fontWeight: "bold" }}>
                            Date issued: {" "}
                        </Text>
                        {new Date(vc.issuanceDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Text>

                    <Text style={styles.text}>
                        <Text style={{ fontWeight: "bold" }}>
                            Expiry date: {" "}
                        </Text>

                    </Text>

                </View>
            </View>
        </Pressable >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
    },

    cardContent: {
        flex: 1,
        flexDirection: 'column',
        gap: 5,
    },

    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    vcTitle: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        flex: 1,
        flexWrap: 'wrap',
    },

    image: {
        flex: 1,
        height: 60,
        minWidth: 60,
        maxWidth: 60,
        borderRadius: 10,
    },

    cardBody: {
        flex: 1,
        flexDirection: 'column',
        gap: 0,
    },

    text: {
        fontSize: 14,
        color: '#fff',
        fontWeight: "normal",
    },
})