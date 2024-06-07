import React, { useEffect, useRef, useState } from 'react';
import { fabric } from "fabric";
import "../../styles/DrawCanvas.css";
import { CgUndo } from "react-icons/cg";
import { FaMouse } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import { FaHandPaper } from "react-icons/fa";
import { MdOutlineTextFields } from "react-icons/md";
import { IoIosSave } from "react-icons/io";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement('#root');

const DrawCanvas = ({ id, canvasData, setCurrentPage }) => {
    const canvasContainerRef = useRef(null);
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [activeTool, setActiveTool] = useState("pen");
    const [history, setHistory] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isOpen, setIsOpen] = useState(false);
    const nickname = sessionStorage.getItem('nickname');

    const modalSave = () => {
        const inputElement = document.getElementById("titleInput");
        const drawTitle = inputElement.value;
        const canvasData = canvas.toJSON();
        const studyId = id;
        const timestamp = new Date().toISOString();

        axios.post('/api/canvas/draw', {
            drawTitle: drawTitle,
            studyId: studyId,
            nickname: nickname,
            canvasData: canvasData,
            timestamp: timestamp
        })
            .then(response => {
                console.log(response.data);
                setCurrentPage("자유");
            })
            .catch(error => {
                console.error('Error saving drawing:', error);
            });
    }

    const openModal = () => {
        setIsOpen(true);
    };
    const closeModal = () => {
        setIsOpen(false);
        setActiveTool("select");
    };

    const customStyles = {
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            width: "100%",
            height: "100vh",
            zIndex: "10",
            position: "fixed",
            top: "0",
            left: "0",
        },
        content: {
            width: "600px",
            height: "280px",
            zIndex: "150",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "10px",
            boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
            backgroundColor: "white",
            justifyContent: "center",
            overflow: "auto",
        },
        h1: {
            fontSize: "24px",
            marginBottom: "10px",
        },
        p: {
            fontSize: "16px",
            marginBottom: "20px",
        },
        input: {
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxSizing: "border-box",
        },
        buttonsContainer: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
        },
        button: {
            width: "45%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
        },
        closeButton: {
            width: "45%",
            padding: "10px",
            backgroundColor: "#ccc",
            color: "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            textAlign: "center",
        },
    };

    useEffect(() => {
        const canvasContainer = canvasContainerRef.current;
        const newCanvas = new fabric.Canvas(canvasRef.current, {
            width: canvasContainer.offsetWidth,
            height: canvasContainer.offsetHeight,
        });
        setCanvas(newCanvas);

        newCanvas.on("mouse:wheel", function (opt) {
            const delta = opt.e.deltaY;
            let zoom = newCanvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            newCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });

        const handleResize = () => {
            newCanvas.setDimensions({
                width: canvasContainer.offsetWidth,
                height: canvasContainer.offsetHeight,
            });
        };
        window.addEventListener("resize", handleResize);

        if (canvasData) {
            newCanvas.loadFromJSON(canvasData, () => {
                newCanvas.renderAll();
                saveToHistory(newCanvas);
            });
        } else {
            saveToHistory(newCanvas);
        }

        return () => {
            newCanvas.dispose();
            window.removeEventListener("resize", handleResize);
        };
    }, [canvasData]);

    useEffect(() => {
        if (!canvasContainerRef.current || !canvasRef.current || !canvas) return;

        canvas.off("mouse:down");
        canvas.off("mouse:move");
        canvas.off("mouse:up");

        switch (activeTool) {
            case "select":
                handleSelectTool();
                break;
            case "pen":
                handlePenTool();
                break;
            case "hand":
                handleHandTool();
                break;
            case "undo":
                handleUndoTool();
                break;
            case "text":
                handleTextTool();
                break;
            case "save":
                handleSaveTool();
                break;
        }
    }, [activeTool]);

    const handleSaveTool = () => {
        console.log("모달");
        openModal();
    }

    const handleTextTool = () => {
        canvas.isDrawingMode = false;
        canvas.defaultCursor = "text";
        canvas.selection = false;

        const addText = (opt) => {
            const pointer = canvas.getPointer(opt.e);
            const text = new fabric.IText('Enter text', {
                left: pointer.x,
                top: pointer.y,
                fontFamily: 'arial',
                fill: '#333',
                fontSize: 20,
            });
            canvas.add(text).setActiveObject(text);
            saveToHistory(canvas);
            canvas.off('mouse:down', addText);
            setActiveTool('select');
        };

        canvas.on('mouse:down', addText);
    };

    const handleSelectTool = () => {
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.defaultCursor = "default";
    };

    const handlePenTool = () => {
        canvas.freeDrawingBrush.width = 10;
        canvas.isDrawingMode = true;

        canvas.on('path:created', () => {
            saveToHistory(canvas);
        });
    };

    const handleHandTool = () => {
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = "move";

        let panning = false;
        const handleMouseDown = () => {
            panning = true;
        };
        const handleMouseMove = (event) => {
            if (panning) {
                const delta = new fabric.Point(event.e.movementX, event.e.movementY);
                canvas.relativePan(delta);
            }
        };
        const handleMouseUp = () => {
            panning = false;
        };
        canvas.on("mouse:down", handleMouseDown);
        canvas.on("mouse:move", handleMouseMove);
        canvas.on("mouse:up", handleMouseUp);
    };

    const handleUndoTool = () => {
        if (currentIndex > 0) {
            const previousState = history[currentIndex - 1];
            canvas.loadFromJSON(previousState, () => {
                canvas.renderAll();
                setCurrentIndex(currentIndex - 1);
            });
        }
    };

    const saveToHistory = (canvas) => {
        const state = canvas.toJSON();
        const newHistory = history.slice(0, currentIndex + 1);
        newHistory.push(state);
        setHistory(newHistory);
        setCurrentIndex(currentIndex + 1);
    };

    return (
        <div className="canvas-container" ref={canvasContainerRef}>
            <canvas ref={canvasRef} />
            <div className="tool-bar">
                <button
                    onClick={() => setActiveTool("select")}
                    disabled={activeTool === "select"}
                >
                    <FaMouse size={25} />
                </button>
                <button
                    onClick={() => setActiveTool("pen")}
                    disabled={activeTool === "pen"}
                >
                    <RiPencilFill size={25} />
                </button>
                <button
                    onClick={() => setActiveTool("hand")}
                    disabled={activeTool === "hand"}
                >
                    <FaHandPaper size={25} />
                </button>
                <button
                    onClick={() => setActiveTool("undo")}
                    disabled={activeTool === "undo"}
                >
                    <CgUndo size={25} />
                </button>
                <button
                    onClick={() => setActiveTool("text")}
                    disabled={activeTool === "text"}
                >
                    <MdOutlineTextFields size={25} />
                </button>
                <button
                    onClick={() => setActiveTool("save")}
                    disabled={activeTool === "save"}
                >
                    <IoIosSave size={25} />
                </button>
            </div>
            <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
                <h1 style={customStyles.h1}>저장</h1>
                <p style={customStyles.p}>제목을 입력해주세요</p>
                <input id="titleInput" style={customStyles.input} />
                <div style={customStyles.buttonsContainer}>
                    <button style={customStyles.button} onClick={modalSave}>저장</button>
                    <button style={customStyles.closeButton} onClick={closeModal}>닫기</button>
                </div>
            </Modal>
        </div>
    );
};

export default DrawCanvas;
