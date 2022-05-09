# 개요

[백준](https://www.acmicpc.net) 이나 [코드포스](https://codeforces.com) 문제를
풀 때 여러 케이스를 실행하여 결과를 보여줍니다.

PSOJ = Problem Solving Offline Judge

# 사용환경

- Bash 가 설치된 시스템에서는 실행가능하도록 하는 것이 목적이지만, 아직 리눅스를 제외한 시스템에서는 테스트 되지 않았습니다.
- `npx` 가 설치되어 있어야 합니다.
- 사용하고자 하는 언어가 설치되어 있어야 함

# 사용법

```sh
$ npx psoj <keyword>
```

`keyword` 를 포함한 디렉토리의 소스파일이 실행됩니다.
컴파일이 필요한 경우 컴파일 후 실행됩니다.

# 지원하는 언어

- c++ `.cc` `.cpp`
- java `.java`
- nodejs `.js`
- python3 `.py`
- php `.php`
- ruby `.rb`

# 디렉토리 구조

```bash
├── math
│   ├── 1000
│   │   ├── 1.in
│   │   ├── 1.out
│   │   ├── 2.in
│   │   ├── 2.out
│   │   ├── 3.input.txt
│   │   ├── 3.output.txt
│   │   ├── main.cc
│   │   └── main.py
│   └── 1001
│       ├── 1.in
│       └── main.js
├── search
│   ├── 1012
```

- 입력: `*.in` `*input*`
- 정답: `*.out` `*output*`
- 소스: `main.*` `index.*` `problem.*` (psoj.json 설정파일에서 설정 가능합니다)

`1001` 디렉토리와 같이 정답은 없어도 실행 가능합니다.

## 실행결과 - 정답이 있는 경우

```sh
$ npx psoj 1000
Source: ./math/1000/main.py

✔ #1
✔ #2
✘ #3

expected:
40
result:
30

2/3 cases passed.
```

## 실행결과 - 정답이 없는 경우

```sh
$ npx psoj 1001
Source: ./math/1001/main.js

☐ #1

result:
30

1 unknown case.
```

# 설정

`npx psoj` 를 실행하는 디렉토리에 `psoj.json` 파일을 생성하여 다음과 같이 설정

```json
{
  "extensions": ["js", "java"]
}
```

- `extensions`: 실행가능한 소스파일이 여러가지일 경우 우선순위를 설정합니다.
