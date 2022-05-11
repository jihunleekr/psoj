# 개요

[백준](https://www.acmicpc.net) 이나 [코드포스](https://codeforces.com) 문제를
풀 때 여러 케이스를 실행하여 결과를 보여줍니다.

PSOJ = Problem Solving Offline Judge

# 설치

- `node` `npx` 가 설치되어 있어야 합니다.
- 사용하고자 하는 언어가 설치되어 있어야 합니다.

# 사용법

```sh
$ npx psoj <keyword>
```

`keyword` 를 포함한 디렉토리의 소스파일이 실행됩니다.
컴파일이 필요한 경우 컴파일 후 실행됩니다.

# 지원하는 언어

- c `.c`
- c++ `.cc` `.cpp`
- golang `.go`
- java `.java`
- kotlin `.kt`
- nodejs `.js`
- typescript `.ts`
- python3 `.py`
- php `.php`
- ruby `.rb`
- rust `.rs`

# 문제풀이 디렉토리 구조 예시

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
│        ├── 1.in
│        └── main.js
├── search
│   ├── 1012
```

- 입력: `*.in*` `*input*`
- 정답: `*.out*` `*output*`
- 소스: `main.*` `index.*` `problem.*` [순서 변경이나 다른 이름도 가능합니다](#설정파일)

`1001` 디렉토리와 같이 정답파일이 없어도 실행 가능합니다.

## 실행결과: 정답이 있는 경우

```sh
$ npx psoj 1000
Source: ./math/1000/main.py

✔  1.in 49.37ms
✔  2.in 52.50ms
✘  3.input.txt 56.29ms

expected:
40
result:
30

2/3 cases passed.
```

## 실행결과: 정답이 없는 경우

```sh
$ npx psoj 1001
Source: ./math/1001/main.js

☐  1.in 54.77ms

result:
30

1 unknown case.
```

# 설정파일

`npx psoj` 를 실행하는 디렉토리에 `psoj.json` 파일을 생성하여 다음과 같은 옵션을 설정할 수 있습니다. (선택사항)

```json
{
  "extensions": ["js", "java"],
  "sourceNames": ["main", "index", "problem"]
}
```

- `extensions`: 확장자 우선순위
- `sourceNames`: 같은 확장자일때 이름 우선순위

소스파일이 2개 이상일때부터 의미가 있는 옵션입니다.
소스파일이 1개인 경우에는 그 소스파일이 실행됩니다.

# 지원 운영체제

- 리눅스에서 사용 가능함.
- 윈도우에서 `gitbash` 내에서 테스트 됨.
- macOS 에서 테스트 되지 않음.
- 모든 운영체제에서 별다른 설정없이 사용할 수 있도록 하고자 함.
