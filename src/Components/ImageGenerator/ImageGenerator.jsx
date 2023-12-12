import { div, input } from '@tensorflow/tfjs'
import React, { useEffect, useRef, useState, setState } from 'react' 
import './ImageGenerator.css'
import default_image from '../Assets/default_image.png'
import { storage } from '../../firebase'
import { ref, uploadBytes, uploadString, listAll, getDownloadURL, getMetadata } from "firebase/storage"
import { v4 } from 'uuid'
import shadow1 from "../Assets/shadow-01.svg"
import shadow2 from "../Assets/shadow-02.svg"
import shadow3 from "../Assets/shadow-03.svg"
import borderShape1 from "../Assets/borderShape-01.svg"
import borderShape2 from "../Assets/borderShape-02.svg"
import borderShape3 from "../Assets/borderShape-03.svg"
import borderShape4 from "../Assets/borderShape-04.svg"
import borderShape5 from "../Assets/borderShape-05.svg"
import borderShape6 from "../Assets/borderShape-06.svg"
import shape1 from "../Assets/shape-01.svg"
import shape2 from "../Assets/shape-02.svg"
import shape3 from "../Assets/shape-03.svg"
import shape4 from "../Assets/shape-04.svg"
import shape5 from "../Assets/shape-05.svg"
import shape6 from "../Assets/shape-06.svg"
import shape7 from "../Assets/shape-07.svg"
import shape8 from "../Assets/shape-08.svg"
import shape9 from "../Assets/shape-09.svg"
import shape10 from "../Assets/shape-10.svg"
import shape11 from "../Assets/shape-11.svg"
import shape12 from "../Assets/shape-12.svg"
import penBody from "../Assets/pen-body.svg"
import penCap from "../Assets/pen-cap.svg"
import { upload } from '@testing-library/user-event/dist/upload'

function ImageGenerator() {

    //View States
    const [loading, setLoading] = useState(false);
    const [animateLoading, setAnimateLoading] = useState(false);
    const [imageCreated, setImageCreated] = useState(false);
    const [picking, setPicking] = useState(false);
    const [pickingColor, setPickingColor] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showingCollection, setShowingCollection] = useState(false);
    const [selectedShape, setSelectedShape] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    
    const [drawingLoop, setDrawingLoop] = useState(0);
    const testWithNoGeneration = false;
    const testWithNoUpload = false;

    var remoteTestImageURL = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-wTmsDuvjw0xVZ4SFQLXtPdXl/user-yWj9OiHuDcKQOhzYZ1c60eRe/img-qXON9FxTQmpqCaDmm9buYLVA.png?st=2023-12-05T15%3A00%3A38Z&se=2023-12-05T17%3A00%3A38Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-12-04T22%3A46%3A56Z&ske=2023-12-05T22%3A46%3A56Z&sks=b&skv=2021-08-06&sig=Y/Q79zyxrnJsKq/u9pAqpGqjcCmJxs2NpgmQartg1to%3D";
    const [imageList, setImageList] = useState([]);
    const [metaData, setMetaData] = useState([]);
    const imageListRef = ref(storage, "images/");
    const shapeArray = [shape1, shape2, shape3, shape4, shape5, shape6, shape7, shape8, shape9, shape10, shape11, shape12];
    const shapeColorArray = [[shape1, shape4, shape5, shape6], [shape2, shape7, shape8, shape9], [shape3, shape10, shape11, shape12]];
    const shadowArray = [shadow1, shadow2, shadow3];
    const [originalPrompt, setOriginalPrompt] = useState("");
    const promptStyling1 = "simple, minimal doodle on a white color background. one subject only, isolated. the focus is "
    const promptStyling2 = ", in a hand drawn technique with thick outlines. use only colors black and white. the background is white and isolated. bold lines, easy, light, soft aesthetic, grainy texture, riso noise, riso patterns, textures --v 5.2. Avoid adding text or writing out words. No words. No text. No color. "

    var count = 0;

    const didPressSelector = (isLeft) => {
        if(isLeft) {
            console.log("Pressed left!");
            if(!pickingColor) setSelectedShape((selectedShape - 1)%3);
            else setSelectedColor((selectedColor - 1)%4);
        }
        else { 
            console.log("Pressed right!");
            if(!pickingColor) setSelectedShape((selectedShape + 1)%3);
            else setSelectedColor((selectedColor + 1)%4);
        }
    }

    const [imageUpload, setImageUpload] = useState(null);
    var wasUploaded = false;

    //==================+WORKING HERE!!===========================//

    const didPressNext = () => {
        console.log("Pressed next");
        if(!imageCreated) {
            imageGenerator();
            return;
        }
        if(picking===false) {
            setPicking(true);
            return;
        }
        if(pickingColor===false) {
            setPickingColor(true);
            return;
        } 
        if(uploading===false) {

        } 
        console.log("Set state to uploading");
        setUploading(true);
        if(testWithNoGeneration) {
            setImageUpload(testImageB64);
            return;
        } 
        setImageUpload(image_url);

        return;
    }


    useEffect(() => {
        console.log("Ready to upload that");
        if(testWithNoUpload) return;
        uploadImage();
    },[imageUpload])
 
    useEffect(() => {
        return;
        if(count > 0) return;
        listAll(imageListRef).then((response) => {
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    // setImageList((prev) => [...prev,url]);
                    getMetadata(item).then((metadata) => {
                        if(metadata.customMetadata != null) {
                            // console.log(metadata);
                            setMetaData((prev) => [...prev,
                                {
                                    'imageData': url,
                                    'color': metadata.customMetadata.color,
                                    'prompt': metadata.customMetadata.prompt,
                                    'shape': metadata.customMetadata.shape
                                }
                            ])    
                        }
                    })
                })

            })
        });
        console.log("recorded");
        console.log(metaData);
        count++;
    }, []);

    const uploadImage = () => {
        if (imageUpload == null ) {
            console.log("Image was null");
            return;
        }
        console.log(imageUpload);
        const imageRef = ref(storage, `images/${v4()}`);
        console.log("Original prompt: " + originalPrompt);

        uploadString(imageRef,imageUpload, 'base64', {
            contentType: 'image/jpeg',
            customMetadata: {
                'shape': selectedShape,
                'color': selectedColor,
                'prompt': originalPrompt
            }
            }).then(() => {
            showCollection();
        })
    }    
    
    const showCollection = () => {
        // alert("Image uploaded!");
        setTimeout(function() {
            setShowingCollection(true);
        }, 2000);
    }

    const [image_url,setImage_url] = useState("/");
    let inputRef = useRef(null);

    const imageGenerator = async () => {
        if(inputRef.current.value==="") {
            return 0;
        }
        setLoading(true);
        console.log(loading);
        var styledPrompt = promptStyling1 + inputRef.current.value + promptStyling2 + inputRef.current.value; 
        setOriginalPrompt(inputRef.current.value);
        console.log(styledPrompt);
        setDrawingLoop(true);
        if(testWithNoGeneration) {
            testLoading();
            return;
        }
        const response = await fetch(
            "https://api.openai.com/v1/images/generations",
            {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                    Authorization: "Bearer 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",
                    "User-Agent":"Chrome",
                },
                body:JSON.stringify ({
                    prompt:`${styledPrompt}`,
                    n:1,
                    model: "dall-e-3",
                    // size:"512x512",
                    response_format: "b64_json"
                })
            }
        ); 
        let data = await response.json();
        console.log(data);
        let data_array = data.data;
        setImage_url(data_array[0].b64_json);
        console.log("Next step");
        setAnimateLoading(true);
        setDrawingLoop(false);
        setTimeout(function() {
            setImageCreated(true);
        }, 4000);
        console.log(imageCreated);
    }


    const tryAgain = () => {
        console.log("Try Again");
        setImageCreated(false);
        setAnimateLoading(false);
        imageGenerator();
    }

    const testLoading = () => {
        console.log("Fake loading test");
        setTimeout(function() {
            setAnimateLoading(true);
            setTimeout(function() {
                setImageCreated(true);
            }, 2000);
        }, 4200);
    }

    useEffect(() => {
        if(loading && !imageCreated) {
            const interval = setInterval(() => {
                console.log("Changing " + drawingLoop);
                console.log(drawingLoop);
                setDrawingLoop(!drawingLoop);
            }, 1000);

            return () => clearInterval(interval)
        }
    },[drawingLoop])

    var stickerShapeCount = 2;
    var stickerRandomNumber = 0;
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
    
    let classNames = [];
    classNames.push("start");
    if(loading) classNames.push("loading");
    if(animateLoading) classNames.push("animateLoading");
    if(imageCreated) classNames.push("imageCreated");
    if(picking) classNames.push("picking");
    if(uploading) classNames.push("uploading");
    if(showingCollection) classNames.push("showingCollection");

    return (
        <div className='ai-image-generator'>
            <div className={'penContainer ' + classNames.join(" ") + (!drawingLoop?"":" drawingLoop")}>
                <img className="penCap" src={penCap} alt="" />
                <img className="penBody" src={penBody} alt="" />
            </div>
            <div className={'borderShapesContainer ' + classNames.join(" ")}>
                <img className="borderShape1" src={borderShape1} alt="" />
                <img className="borderShape2" src={borderShape2} alt="" />
                <img className="borderShape3" src={borderShape3} alt="" />
                <img className="borderShape4" src={borderShape4} alt="" />
                <img className="borderShape5" src={borderShape5} alt="" />
                <img className="borderShape6" src={borderShape6} alt="" />
            </div>
            {/* <div className={loading?"header fadeAway":"header"}>My wish for 2024 is to…</div> */}
            {/* <div className={!imageCreated?"header fadeAway":"header fadeIn"}> */}
            <div className={'header ' + classNames.join(" ")}>
                {(() => {
                    if(pickingColor) {
                        return <span>Choose your color</span>
                    } else if (picking) {
                        return <span>Choose your shape</span>
                    } else if(imageCreated) {
                        return <span>Your drawing!</span>
                    } else if(loading) {
                        return <span>drawing...</span>
                    } else {
                        return <span>My wish for 2024 is to…</span>
                    }

                })()}
            </div>            

            <div className={'search-box ' + classNames.join(" ")} >
                <div className="stickerLiftTarget">
                    <div className="stickerLiftContainer">  
                        <div className={animateLoading?"image":"image not-loaded"}>
                            <img id="imageid" src={image_url==="/"?default_image:"data:image/jpeg;base64,"+ image_url} alt="" />
                        </div>
                        <div className={picking?"shapeBox":"display-none"}>
                            <img src={shapeColorArray[selectedShape][selectedColor]} alt="" />
                        </div>
                        <textarea maxlength="80" className={!animateLoading?"search-input":"search-input not-loaded"} type="text" ref={inputRef} disabled={loading} placeholder='add your wish here...' />
                    </div>
                    <img src={shadowArray[selectedShape]} alt="" className="stickerBackground shadow" />
                    <div className="originalPromptBox">
                            <div className="start">My wish for 2024 is to...</div>
                            <div className="userPrompt">{originalPrompt}</div>
                        </div>
                </div>
            </div>

            <div className={"customizationButtonBox " + classNames.join(" ")} >
                <div className="customizationButton left" onClick={() => {didPressSelector(true)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="44" viewBox="0 0 30 44" fill="none">
                        <path d="M5.5 5L22.5 22L5.5 39" stroke="white" stroke-width="9.62264" stroke-linecap="round"/>
                    </svg>
                </div>
                <div className="customizationButton right" onClick={() => {didPressSelector(false)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="44" viewBox="0 0 30 44" fill="none">
                        <path d="M5.5 5L22.5 22L5.5 39" stroke="white" stroke-width="9.62264" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
            <div className="lowerButtonBox">
                {/* <div className={loading?"generate-btn fadeAway":"generate-btn"} onClick={()=>{imageGenerator()}}>Share my wish!</div> */}
            
                <div className={'generate-btn ' + classNames.join(" ")} onClick={()=>{didPressNext()}}>
                    {(() => {
                        if(imageCreated) {
                            return <span>Next</span>
                        } else {
                            return <span>Share my wish!</span>
                        }

                    })()}
                </div>
                {/* <div className={!imageCreated?"generate-btn fadeAway":"generate-btn"} onClick={()=>{didPressNext()}}>Next</div> */}
                <div className={picking?"display-none":"invert"}>
                    <div className={!imageCreated?"generate-btn fadeAway":"generate-btn"} onClick={()=>{tryAgain()}}>try again</div>
                </div>
            </div>
            <div className={"stickerContainer " + classNames.join(" ")}>
                <div className={"sticker placeholder"}>
                        <img className="stickerImage"  />    
                        <img src={shapeArray[0]} alt="" className="stickerBackground " />

                </div>


                {metaData.map((url) => {
                    console.log(url);
                    stickerShapeCount++;
                    var stickerStyle = {zIndex: stickerShapeCount+10};
                    return <div className={"sticker "  + ((stickerShapeCount-1)%3==2?" down":"") }>
                        <div className="stickerLiftTarget" style={stickerStyle}>
                            <div className="stickerLiftContainer">  
                                <img className="stickerImage" src={url.imageData} />    
                                <img src={shapeColorArray[url.shape][url.color]} alt="" className="stickerBackground " />
                            </div>
                            <img src={shadowArray[url.shape]} alt="" className="stickerBackground shadow" />
                        </div>
                        <div className="originalPromptBox">
                            <div className="start">My wish for 2024 is to...</div>
                            <div className="userPrompt">{url.prompt}</div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default ImageGenerator