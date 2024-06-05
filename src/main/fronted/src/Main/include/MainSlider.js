import React from "react";
import {Carousel} from "react-bootstrap";

export const MainSlider = () => {
    return (
        <div className="MainSlider dark-made">
            <Carousel>
                <Carousel.Item style={{height: '512px'}}>
                    <img
                        className="d-block w-100"
                        src="https://via.placeholder.com/800x400.png?text=First+Slide"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3>첫번째 슬라이더 라벨</h3>
                        <p>계속 돌아가는 광고판 1</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item style={{height: '512px'}}>
                    <img
                        className="d-block w-100"
                        src="https://via.placeholder.com/800x400.png?text=Second+Slide"
                        alt="Second slide"
                    />

                    <Carousel.Caption>
                        <h3>두번째 슬라이더 라벨</h3>
                        <p>계속 돌아가는 광고판 2</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item style={{height: '512px'}}>
                    <img
                        className="d-block w-100"
                        src="https://via.placeholder.com/800x400.png?text=Third+Slide"
                        alt="Third slide"
                    />

                    <Carousel.Caption>
                        <h3>세번째 슬라이더 라벨</h3>
                        <p>계속 돌아가는 광고판 3</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    );
}
