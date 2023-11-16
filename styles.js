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
      bottom:-7,
    },
    titleFocus: {
      fontFamily: "Inter",
      fontSize: 24,
      borderBottomColor: "#DF85FF",
      borderBottomWidth: 1,
      width: 200,
      marginLeft: 25,
      marginTop: 20,
      bottom:-7,
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
      fontSize: 30,
      marginTop: 175,
      position: "relative",
      zIndex: 100,
    },
  };

  export { postStyles, editStyles, uploadStyles, exploreStyles };