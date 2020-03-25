import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image
} from "@react-pdf/renderer";

import {Table, TableHeader, TableCell, TableBody, DataTableCell} from "@david.kucsai/react-pdf-table"

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#ffffff"
    },
    header:{
        backgroundColor:'red'
    },
    header_sub1:{
        width:"100%",
        backgroundColor:'yellow'
    },
    table:{
        backgroundColor:'blue'
    },
    footer:{
        backgroundColor:'green'
    },



    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    movieContainer: {
        backgroundColor: "#f6f6f5",
        display: "flex",
        flexDirection: "row",
        padding: 5
    },
    movieDetails: {
        display: "flex",
        marginLeft: 5
    },
    movieTitle: {
        fontSize: 15,
        marginBottom: 10
    },
    movieOverview: {
        fontSize: 10
    },

    image: {
        height: 200,
        width: 150
    },
    subtitle: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        width: 150,
        alignItems: "center",
        marginBottom: 12
    },
    vote: {
        display: "flex",
        flexDirection: "row"
    },
    rating: {
        height: 10,
        width: 10
    },
    vote_text: {
        fontSize: 10
    },
    vote_pop: {
        fontSize: 10,
        padding: 2,
        backgroundColor: "#61C74F",
        color: "#fff"
    },
    vote_pop_text: {
        fontSize: 10,
        marginLeft: 4
    },
    overviewContainer: {
        minHeight: 110
    },
    detailsFooter: {
        display: "flex",
        flexDirection: "row"
    },
    lang: {
        fontSize: 8,
        fontWeight: 700
    },
    vote_average: {
        fontSize: 8,
        marginLeft: 4,
        fontWeight: "bold"
    }
});


{/* <View key={index} style={styles.movieContainer}>
    <Image
        style={styles.image}
        source={
            a.poster_path !== null
                ? `${POSTER_PATH}${a.poster_path}`
                : "150.jpg"
        }
    />
    <View style={styles.movieDetails}>
        <Text style={styles.movieTitle}>{a.title}</Text>

        <View style={styles.subtitle}>
            <View style={styles.vote}>
                <Image source="star.png" style={styles.rating} />
                <Text style={styles.vote_text}>{a.vote_count}</Text>
            </View>
            <View style={styles.vote}>
                <Text style={styles.vote_pop}>{a.popularity}</Text>
                <Text style={styles.vote_pop_text}>Popularity</Text>
            </View>
        </View>

        <View style={styles.overviewContainer}>
            <Text style={styles.movieOverview}>{a.overview}</Text>
        </View>

        <View style={styles.detailsFooter}>
            <Text style={styles.lang}>
                Language: {a.original_language.toUpperCase()}
            </Text>
            <Text style={styles.vote_average}>
                Average Votes: {a.vote_average}
            </Text>
            <Text style={styles.vote_average}>
                Release Date:{" "}
                {moment(a.release_date, "YYYY-MM-DD").format(
                    " MMMM D Y"
                )}
            </Text>
        </View>
    </View>
</View> */}


export function PdfDocument(props) {
    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.header_sub1}>
                        <View>
                            <Text>LEAGUE NAME</Text>
                        </View>
                        <View>
                            <Text>GAME SHEET</Text>
                        </View>
                        <View>
                            <Text>DATE:  ___________________________</Text>
                            <Text>TIME:  ___________________________</Text>
                            <Text>FIELD: ___________________________</Text>

                            <View style={{width:'100%', display:"flex", flexDirection: "row"}}>
                                <View style={{flexGrow:1}}>
                                    <Text>HOME TEAM: _</Text>
                                </View>
                                <View style={{flexGrow:1}}>
                                    <Text>TEAM COLOR: _</Text>
                                </View>
                            </View>

                            <View>
                                <View>
                                    <Text>AWAY TEAM: ___________________________</Text>
                                </View>
                                <View>
                                    <Text>AWY COLOR: _______________</Text>
                                </View>
                            </View>

                        </View>
                    </View>
                </View>
                <View style={styles.table}>
                    <Text>table</Text>
                </View>
                <View style={styles.footer}>
                    <Text>footer</Text>
                </View>

                <Table
                    data={[
                        {firstName: "John", lastName: "Smith", dob: new Date(2000, 1, 1), country: "Australia", phoneNumber: "xxx-0000-0000"}
                    ]}
                >
                    <TableHeader>
                        <TableCell>
                            First Name
                        </TableCell>
                        <TableCell>
                            Last Name
                        </TableCell>
                        <TableCell>
                            DOB
                        </TableCell>
                        <TableCell>
                            Country
                        </TableCell>
                        <TableCell>
                            Phone Number
                        </TableCell>
                    </TableHeader>
                    <TableBody>
                        <DataTableCell getContent={(r) => r.firstName}/>
                        <DataTableCell getContent={(r) => r.lastName}/>
                        <DataTableCell getContent={(r) => r.dob.toLocaleString()}/>
                        <DataTableCell getContent={(r) => r.country}/>
                        <DataTableCell getContent={(r) => r.phoneNumber}/>
                    </TableBody>
                </Table>

            </Page>
        </Document>
    );
}
