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
      const response = await fetch("http://localhost:8000/globalScore");
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
      const response = await fetch("http://localhost:8000/user/friends", {
        method: "GET",
        credentials: "include",
      });
      const friendRankings = await response.json();
      console.log(friendRankings);
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
          console.log(entry);
          console.log(entry.userName, entry.maxScore);

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
    const response = await fetch("http://localhost:8000/user/login", {
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
      console.log("some error");
    } else {
      const accessToken = data.accessToken;
      console.log(accessToken);

      const friendRankingsButton = document.querySelector(".friend-rankings");
      friendRankingsButton.click();
    }
  } catch (e) {
    console.log("error: ", e);
  }
});

const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value;
  const userName = document.getElementById("userName").value;

  try {
    const response = await fetch("http://localhost:8000/user/signup", {
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
    console.log("some error", err);
  }
});

// -----------------------

document
  .querySelector(".view-friend-requests")
  .addEventListener("click", () => {
    displayChild(".received-requests-container");
  });

document
  .querySelector(".send-friend-requests")
  .addEventListener("click", () => {
    displayChild(".send-friend-request-form-container");
  });

const globalRankingsBtn = document.querySelector(".global-rankings");
globalRankingsBtn.click();
