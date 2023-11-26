const postStyles = {
    default: {
      fontFamily: 'Inter',
    },
    postMobile: {
      textAlign: "center",
      fontSize: 18,
      color: "#DF85FF",
    },
    postBackButton: {
      marginTop:1,
      width:29,
      height:20,
    },
    postMobileTitles: {
      paddingTop: "3%",
      paddingLeft: "4%",
    },
    postMobileTitle: {
      fontWeight: "bold",
      fontSize: 20,
    },
    postMobileSubtitle: {
      fontSize: 16,
      color: "#6C6C6C",
    },
    seperator: {
      borderBottomWidth: 1,
      paddingTop: "4%",
      width: "90%",
      marginLeft: "5%",
      borderBottomColor: "#B5B5B5",
    },
    profile: {
      fontWeight: "bold",
      fontSize: 20,
      paddingTop: "5%",
      paddingLeft: "6%",
    },
    postTextContainer: {
      fontSize: 14,
      paddingTop: "10%",
      paddingLeft: "6%",
    },
    postDescription: {
      color: "#000000",
    },
    postTags: {
      paddingTop: "4%",
      color: "#DF85FF",
    },
  };

  const editStyles = {
    title: {
      fontFamily: "Inter",
      fontSize: 24,
      borderBottomColor: "black",
      borderBottomWidth: 1,
      width: 200,
      marginLeft: 25,
      marginTop: 20,
      marginBottom:30,
    },
    titleFocus: {
      fontFamily: "Inter",
      fontSize: 24,
      borderBottomColor: "#DF85FF",
      borderBottomWidth: 1,
      width: 200,
      marginLeft: 25,
      marginTop: 20,
      marginBottom:30,
    },
    postDescription: {
      backgroundColor: "#D9D9D9",
      width: "60%",
      height: 100,
      marginLeft: 150,
      borderRadius: 5,
      paddingLeft: 10,
      top: -130,
    },
    postDescriptionError: {
      backgroundColor: "#D9D9D9",
      width: "60%",
      height: 100,
      marginLeft: 150,
      borderRadius: 5,
      paddingLeft: 10,
      top: -140,
      borderColor: "#F71111",
    },
    postDescriptionFocus: {
      backgroundColor: "#D9D9D9",
      borderColor: "#DF85FF",
      width: "60%",
      height: 100,
      marginLeft: 150,
      borderRadius: 5,
      borderWidth:2,
      paddingLeft: 10,
      top: -130,
    },
    previewImageWeb: {
      display: "flex",
      marginLeft: 50,
      borderRadius: 10,
      marginTop: 10,
    },
    previewImageMobile: {
      display: "flex",
      marginLeft: 25,
      borderRadius: 10,
      marginTop: 20,
      top:-30,
    },
    categoryListContainer: {
      borderTopColor: "#C6C6C6",
      borderTopWidth: 1,
      marginTop:-100,
    },
    categoryList: {
      width: "40%",
      display: "flex",
      marginLeft: "55%",
    },
    categoryListLabel: {
      display: "flex",
      left: 20,
      top: 27,
    },
    sizeContainer: {
      borderColor: "#C6C6C6",
      borderTopWidth: 1,
      marginTop: 20,
      borderBottomWidth: 1,
      paddingBottom: 20,
    },
    tagsContainer: {
      backgroundColor: "#D9D9D9",
      width: "90%",
      height: 100,
      borderRadius: 5,
      marginLeft: 20,
      top: 50,
      paddingLeft: 5,
    },
    previewMobile: {
      textAlign: "center",
      fontSize: 18,
      color: "#DF85FF",
    },
    previewMobileInvalid: {
      textAlign: "center",
      fontSize:18,
      color:"#D9D9D9",
    },
    priceFocus: {
      borderWidth: 2,
      borderRadius:5,
      borderColor:"#DF85FF",
      width: "20%",
      height:"8%",
      display:"flex",
      marginLeft:"70%",
      bottom:30,
    },
    priceUnfocus: {
      borderWidth: 2,
      borderRadius:5,
      borderColor:"#C6C6C6",
      width: "20%",
      height:"8%",
      display:"flex",
      marginLeft:"70%",
      bottom:30,
    }
  };

  const uploadStyles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    uploadcontainer: {
      borderWidth: 1,
      marginTop: "6%",
      borderStyle: "solid",
      borderColor: "#dbd8ce",
      borderRadius: 5,
      width: 400,
      height: 600,
      alignItems: "center",
      justifyContent: "center",
      fontSize: 0,
    },
    uploadborder: {
      display: "flex",
    },
    listingText: {
      fontSize: 24,
      fontWeight: "bold",
    },
  };

  const exploreStyles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    webHeader: {
      marginBottom: 30,
      marginTop: 30,
    },
    mobileHeader: {
      marginTop: 20,
      marginBottom: 30,
    },
    cardContainer: {
      width: "90%",
      maxWidth: 400,
      height: 300,
      marginBottom: 100,
    },
    emptyCardContainer: {
      borderWidth: 1,
      marginTop: "6%",
      borderStyle: "solid",
      borderColor: "#dbd8ce",
      borderRadius: 5,
      width: 400,
      height: 600,
      alignItems: "center",
      justifyContent: "center",
    },
    cardWeb: {
      position: "absolute",
      width: "100%",
      maxWidth: 400,
      height: 400,
      borderRadius: 20,
      resizeMode: "cover",
      zIndex: -100,
    },
    cardMobile: {
      position: "absolute",
      width: "100%",
      maxWidth: 600,
      height: 650,
      borderRadius: 20,
      resizeMode: "cover",
      zIndex: -100,
    },
    cardImageMobile: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      borderRadius: 20,
    },
    cardImageWeb: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      borderRadius: 20,
    },
    cardTitle: {
      position: "absolute",
      bottom: 0,
      margin: 10,
      color: "#fff",
    },
    emptyCardTitle: {
      margin: 10,
      fontSize:20,
      color: "#000000",
      textAlign:"center",
      marginLeft:20,
      marginRight:20,
    },
    buttons: {
      margin: 20,
      zIndex: -100,
    },
    infoText: {
      height: 28,
      paddingTop: 30,
      justifyContent: "center",
      display: "flex",
      zIndex: -100,
    },
    likeOrDislikeText: {
      textAlign: "center",
      color: "#fff",
      fontSize: 50,
      position: "absolute",
      zIndex: 100,
      flex:1,
      marginTop:"75%",
      marginLeft:"35%",
    },
    loading: {
      marginTop:"70%",
    },
    loadingText: {
      marginTop:"5%",
      fontFamily: 'Inter',
    }
  };

  const profileStyles = {
    star: {
      width: 18,
      height: 18,
      margin: 1.5,
    },
    listing: {
      height: 115,
      width: 115,
      margin: 2,
    },
    scrollContainer: {
      display: "flex",
      width: "100%",
      padding: "3%",
    },
    userProfilePic: {
      width: 100,
      height: 100,
    },
    userContainerMinusBio: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    usernameContainer: {
      display: "flex",
      justifyContent: "space-around",
      height: 90,
      marginLeft: 10,
      marginBottom: 10,
    },
    username: {
      fontWeight: "bold",
      fontSize: 24,
    },
    starContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    numOfRatings: {
      marginTop: 2,
      fontSize: 16,
    },
    userBio: {
      marginTop: 20,
      fontSize: 16,
    },
    listingsContainer: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
    },
  };

  export { postStyles, editStyles, uploadStyles, exploreStyles, profileStyles };