# Mate Detection Evaluation

This Script is used to decide on what action to take based on the results from the machine learning input.

## Usage

Pipe output JSON from Image Detection to this script.

`fswebcam image.jpg && python classify.py image.jpg | node mate-evaluate.js -f notify-someone -l log`

The expected Input from the classifier should look like the following:

```JSON
{
    "info": {
        "input": "2019-07-28_10-17-34.jpg",
        "output": "2019-07-28_10-17-34_labled.jpg"
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

## Arguments

```
* --always -a =
    if set, the success/fail script will be run each time
    the script is run. Otherwise the scripts will only be
    run when the state changes (looking at the log file)

* --fail -f =
    path to a script that will be executed if mate is NOT
    available

* --success -s =
    path to a script that will be executed if mate is
    available (may be omitted if you only want to notify
    someone if fridge is empty)

* --log -l =
    Default=./log
    path to a log file
    is needed for history sensitive features (like running the
    fail script only on the first failed attempt after a
    successful run).
```

### Sample Log

```
28/02/2019, 14:28:57|Mate is NOT available right now
28/02/2019, 14:29:01|Mate is NOT available right now
28/02/2019, 14:29:06|Mate is NOT available right now
28/02/2019, 14:29:44|Mate is available
28/02/2019, 14:29:46|Mate is available
28/02/2019, 14:29:49|Mate is available
28/02/2019, 14:29:53|Mate is available
28/02/2019, 14:30:06|Mate is NOT available right now
28/02/2019, 14:30:08|Mate is NOT available right now
```
