import React from 'react'
import Button from './Button'

const TempLearn = () => {
    const handleClick_normal = () => {
        console.log("handleClick_normal start");


        console.log("handleClick_normal end");

    };
    const handleClick_heavy = () => {
        console.log("handleClick_heavy start");

        for (let i = 0; i < 5000000000; i++) { }
        console.log("handleClick_heavy end");

    };
    const handleClick_apil = async() => {
        console.log("api start");

        await new Promise((resolve) => {
            setTimeout(resolve, 3000);
        });

        console.log("api end");
    };
    return (
        <div>
            <Button onClick={handleClick_normal} lable='normal func' />
            <Button onClick={handleClick_heavy} lable='heavy func' />
            <Button onClick={handleClick_apil} lable='api func' />
        </div>
    )
}

export default TempLearn
