# Mate Detection Evaluation

This Script is used to decide on what action to take based on the results from the machine learning input.

## Usage

Pipe output JSON from Image Detection to this script.

`fswebcam image.jpg && python classify.py image.jpg | node mate-evaluate.js`

The expected Input from the classifier should look like the following:

```JSON
{
    "info": {
        "imgUrl": "2019-07-28_10-17-34.jpg",
    },
    "results": [
        {
            "label": "bottle",
            "confidence": 0.87
        },
        {
            "label": "bottle",
            "confidence": 0.69
        },
        {
            "label": "table",
            "confidence": 0.53
        }
    ]
}
```
