function displayChild(childClassName) {
  document.querySelectorAll(".js-content-container-child").forEach((child) => {
    child.classList.add("hidden");
  });
  document.querySelector(childClassName).classList.remove("hidden");
}

// on click of the global ranking button
document
  .querySelector(".global-rankings")
  .addEventListener("click", async () => {
    displayChild(".leaderboard-data");
    try {
      const response = await fetch("https://project-flappy-bird-backend.onrender.com/globalScore");
      const globalRankings = await response.json();
      let leaderBoardHTML = `
        <div class="header-card">
            <div class="header-rank">Rank</div>
            <div class="header-name">Name</div>
            <div class="header-score">Score</div>
        </div>
      `;
      globalRankings.forEach((entry, idx) => {
        let playerHTML;
        if (idx == 0) {
          playerHTML = `
            <div class="rank-card first">
                <div class="rank">#${idx + 1}</div>
                <div class="name">${entry.playerName}</div>
                <div class="score">${entry.playerScore}</div>
            </div>
          `;
        } else if (idx == 1) {
          playerHTML = `
            <div class="rank-card second">
                <div class="rank">#${idx + 1}</div>
                <div class="name">${entry.playerName}</div>
                <div class="score">${entry.playerScore}</div>
            </div>
          `;
        } else if (idx == 2) {
          playerHTML = `
            <div class="rank-card third">
                <div class="rank">#${idx + 1}</div>
                <div class="name">${entry.playerName}</div>
                <div class="score">${entry.playerScore}</div>
            </div>
          `;
        } else {
          playerHTML = `
            <div class="rank-card">
                <div class="rank">#${idx + 1}</div>
                <div class="name">${entry.playerName}</div>
                <div class="score">${entry.playerScore}</div>
            </div>
          `;
        }

        leaderBoardHTML += playerHTML;
      });

      document.querySelector(".leaderboard-data").innerHTML = leaderBoardHTML;
    } catch (err) {
      document.querySelector(".leaderboard-data").innerHTML =
        "<h2 style='color: red;'> There was an error </h2>";
    }
  });

// on click of the friend rankings button
document
  .querySelector(".friend-rankings")
  .addEventListener("click", async () => {
    displayChild(".leaderboard-data");

    try {
      const response = await fetch("https://project-flappy-bird-backend.onrender.com/user/friends", {
        method: "GET",
        credentials: "include",
      });
      const friendRankings = await response.json();

      if (friendRankings.errorMessage) {
        displayChild(".login-or-signup-container");
      } else {
        let leaderBoardHTML = `
        <div class="header-card">
            <div class="header-rank">Rank</div>
            <div class="header-name">Name</div>
            <div class="header-score">Score</div>
        </div>
      `;
        friendRankings.forEach((entry, idx) => {
          let playerHTML;
          if (idx == 0) {
            playerHTML = `
            <div class="rank-card first">
                <div class="rank">#${idx + 1}</div>
                <div class="name">${entry.userName}</div>
                <div class="score">${entry.maxScore}</div>
            </div>
          `;
          } else if (idx == 1) {
            playerHTML = `
            <div class="rank-card second">
                <div class="rank">#${idx + 1}</div>
                <div class="name">${entry.userName}</div>
                <div class="score">${entry.maxScore}</div>
            </div>
          `;
          } else if (idx == 2) {
            playerHTML = `
            <div class="rank-card third">
                <div class="rank">#${idx + 1}</div>
                <div class="name">${entry.userName}</div>
                <div class="score">${entry.maxScore}</div>
            </div>
          `;
          } else {
            playerHTML = `
            <div class="rank-card">
                <div class="rank">#${idx + 1}</div>
                <div class="name">${entry.userName}</div>
                <div class="score">${entry.maxScore}</div>
            </div>
          `;
          }

          leaderBoardHTML += playerHTML;
        });

        document.querySelector(".leaderboard-data").innerHTML = leaderBoardHTML;
      }
    } catch (err) {
      console.log(err);
      document.querySelector(".leaderboard-data").innerHTML =
        "<h2 style='color: red;'> There was an error </h2>";
    }
  });

// dealing with the login form and signup form

// deals with looks V
document.querySelectorAll(".js-login-signup-button").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".js-login-signup-button")
      .forEach((otherButton) => {
        otherButton.classList.remove("general-button-selected");
      });
    button.classList.add("general-button-selected");
  });
});

document.querySelector(".login-button").addEventListener("click", () => {
  document.querySelector(".login-form-container").classList.remove("hidden");
  document.querySelector(".signup-form-container").classList.add("hidden");
});

document.querySelector(".signup-button").addEventListener("click", () => {
  document.querySelector(".signup-form-container").classList.remove("hidden");
  document.querySelector(".login-form-container").classList.add("hidden");
});

// deals with form submission:
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;

  try {
    const response = await fetch("https://project-flappy-bird-backend.onrender.com/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: email,
      }),
      credentials: "include",
    });

    const data = await response.json();

    if (data.errorMessage) {
      alert("There was an error! Re-try login!");
    } else {
      const accessToken = data.accessToken;

      const friendRankingsButton = document.querySelector(".friend-rankings");
      friendRankingsButton.click();
    }
  } catch (e) {
    alert("There was an error! Re-try login!");
    console.log("error: ", e);
  }
});

const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value;
  const userName = document.getElementById("userName").value;

  try {
    const response = await fetch("https://project-flappy-bird-backend.onrender.com/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: email,
        userName: userName,
      }),
      credentials: "include",
    });

    const data = await response.json();

    if (data.errorMessage) {
      alert("There was some error");
    } else {
      alert("Kindly login now");
    }
  } catch (err) {
    alert("There was an error! Re-try login!");
    console.log("some error", err);
  }
});

// ----------------------------------------------------

// V dealing with friend requests received V
document
  .querySelector(".view-friend-requests")
  .addEventListener("click", async () => {
    displayChild(".received-requests-container");

    const response = await fetch("https://project-flappy-bird-backend.onrender.com/user/friendRequests", {
      method: "GET",
      credentials: "include",
    });

    let friendRequestsArray = await response.json();
    if (friendRequestsArray.errorMessage) {
      displayChild(".login-or-signup-container");
      return;
    }
    if (friendRequestsArray.length === 0) {
      document.querySelector(
        ".received-requests-container"
      ).innerHTML = `<h2 style="color: red"> You have no requests </h2>`;
      return;
    }
    // const requestsHTML = ``;
    friendRequestsArray = friendRequestsArray.map((friendRequest) => {
      return `<div class="friend-request-card">
                <div class="friend-name">${friendRequest.userName}</div>
                <div class="accept-decline-container">
                    <button class="accept-friend-request-btn" data-id="${friendRequest._id}">Accept</button>
                    <button class="decline-friend-request-btn data-id="${friendRequest._id}">Decline</button>
                </div>
            </div>`;
    });
    friendRequestsArray.join("\n");

    document.querySelector(".received-requests-container").innerHTML =
      friendRequestsArray;

    // event listeners for the generated buttons. these need to be re-attached as the buttons are generated otherwise these won't be attached at all
    document
      .querySelectorAll(".accept-friend-request-btn")
      .forEach((button) => {
        console.log("here");
        button.addEventListener("click", async function () {
          const friendId = this.dataset.id;
          console.log("here");
          try {
            const response = await fetch(
              "https://project-flappy-bird-backend.onrender.com/user/acceptFriendRequest",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                  friendId: friendId,
                }),
                credentials: "include",
              }
            );

            const res = await response.json();

            if (res.errorMessage) {
              alert("There was some error! Try again!");
              return;
            }

            document.querySelector(".view-friend-requests").click(); // update the list again
          } catch (err) {
            console.log("error!", err);
            alert("There was some error!");
          }
        });
      });

    document
      .querySelectorAll(".decline-friend-request-btn")
      .forEach((button) => {
        button.addEventListener("click", async function () {
          const friendId = this.dataset.id;

          try {
            const response = await fetch(
              "https://project-flappy-bird-backend.onrender.com/user/declineFriendRequest",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                  friendId: friendId,
                }),
                credentials: "include",
              }
            );

            const res = await response.json();

            if (res.errorMessage) {
              alert("There was some error! Try again!");
              return;
            }

            document.querySelector(".view-friend-requests").click(); // update the list again
          } catch (err) {
            console.log("error!", err);
            alert("There was some error!");
          }
        });
      });
  });
// ------------------------------------------------------------------------

//! last remaining component
//! also test decline friend request
//! post score to global scoreboard, own score on gamePage.js

document
  .querySelector(".send-friend-requests")
  .addEventListener("click", () => {
    displayChild(".send-friend-request-form-container");
  });

// V deals with the send friend request form
document
  .getElementById("send-friend-request-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const friendEmail = document.getElementById("sendRequestEmail").value;

    const response = await fetch(
      "https://project-flappy-bird-backend.onrender.com/user/sendFriendRequest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: friendEmail,
        }),
        credentials: "include",
      }
    );

    const res = await response.json();

    if (res.errorMessage) {
      alert("Error: " + res.errorMessage);
    } else {
      alert("Friend request sent!");
    }
  });

const globalRankingsBtn = document.querySelector(".global-rankings");
globalRankingsBtn.click();
