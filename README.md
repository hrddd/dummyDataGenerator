# DummyDataGenerator
## Description
This Application generates dummy data like this.
```
[
  {
    id: 0,
    name: '山田 太郎',
    kana: 'やまだ たろう',
    description: 'こんにちは。'
    posts: [
      {
        id: 0,
        title: 'title1',
        star: 200
      }
    ]
  }
]
```
### motivation
Because on Creating prototype application, creating dummy data is disgusting.

## Demo
https://dummydatagenerator.nuhhunnuhhun.now.sh/
https://dummydatagenerator.nuhhunnuhhun.now.sh/inject-array

### On generate
Upload some JSON like this.
```
{
  "id": "number --step 1",
  "name": "fullName",
  "kana": "fullNameKana",
  "avator": "/static/sample_${n}.png",
  "hogePercent": "number --mode random --from 0 --to 1 --decimal 3",
  "description": "description"
}
```

Each value is type of dummy value.
#### number
Serial number or random number.

#### fullName
Kanji name.

#### fullNameKana
Kana corresponding to Kanji name.

#### description
Kanji name.

#### other
As is.
`${n}` in string is replaced with serial number.

### On inject array to data
Upload two JSON, and input a query with some options in text field like this.
```
inject --key posts --match id/author_id --pick id/title/star
```
#### --key

#### --match

#### --pick
