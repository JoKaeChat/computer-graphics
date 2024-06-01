# 컴퓨터 그래픽스 Hierarchy mode 만들기

- [X] 방향키에 따라 고개, 손, 바퀴 회전

- [X] 방향키에 따라 차 움직이기 

- [X] 피규어에 그림자 많이 안 생기도록 광원 위치 수정
      - ambiemtlight값 조정해서 더 밝아지도록 했습니다.

- [X] 트랙 만들기
  - [X] track 함수를 만들어주세요
  - [X] trackVertices 수정 (필요에 따라서는 trackVertices를 사용하지 않고 트랙 좌표를 pointsArray에 직접 push 하셔도 됩니다.)
  - 현재 자동자차 서있는 평면은 z가 -3인 평면 위에 서 있습니다. 
  - 트랙을 그리실 때는 트랙의 점들을 pointsArray에 push 하시면 됩니다.
  - 또한 **각 점마다 법선 벡터를 추가** 해야합니다. 점 하나 추가할 때마다 `normalsArray.push([0,1,0]`을 해주세요
  - 현재 gl의 ArrayBuffer에는 인덱스 0부터 53부터 점들이 이미 추가되어 있는 상태입니다. 
  - 따라 gl.drawArray를 호출해서 트랙을 그릴 때 **시작인덱스는 54** 여야 합니다.
    `ex )  gl.drawArrays(gl.TRIANGLE,54,추가한 점의 개수)`
  - 모르시겠다면 quad 함수를 참고해주세요
  - [ ] track이 짧다면 늘리겠습니다.
    
- [X] 모델 이동
  - 방향키를 누르면 트랙과 모델이 같이 움직입니다. track은 가만히 있도록 수정.

- [ ] 카메라 주행모드 , 관전 모드 만들기
  - 관전 모드 : 3인칭 고정형 카메라(기존 카메라 모드)
  - 주행 모드 : 1인칭 시점. 자동차가 움직임에 따라 카메라도 같이 이동

- [ ]  완주 세레머니



 


