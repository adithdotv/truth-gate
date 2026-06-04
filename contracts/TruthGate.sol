// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
pragma abicoder v2;

/*
=========================================================
                        ENUMS
=========================================================
*/

enum ConsensusType {
    Majority,
    Threshold
}

enum ResponseStatus {
    None,
    Pending,
    Success,
    Failed,
    TimedOut
}

/*
=========================================================
                        STRUCTS
=========================================================
*/

struct Response {
    address validator;
    bytes result;
    ResponseStatus status;
    uint256 receipt;
    uint256 timestamp;
    uint256 executionCost;
}

struct Request {
    uint256 id;
    address requester;
    address callbackAddress;
    bytes4 callbackSelector;
    address[] subcommittee;
    Response[] responses;
    uint256 responseCount;
    uint256 failureCount;
    uint256 threshold;
    uint256 createdAt;
    uint256 deadline;
    ResponseStatus status;
    ConsensusType consensusType;
    uint256 remainingBudget;
    uint256 perAgentBudget;
}

/*
=========================================================
                    INTERFACES
=========================================================
*/

interface IAgentRequester {

    function createRequest(
        uint256 agentId,
        address callbackAddress,
        bytes4 callbackSelector,
        bytes calldata payload
    ) external payable returns (uint256 requestId);

    function getRequestDeposit()
        external
        view
        returns (uint256);
}

interface IJsonApiAgent {

    function fetchUint(
        string memory url,
        string memory selector,
        uint8 decimals
    ) external returns (uint256);

    function fetchString(
        string memory url,
        string memory selector
    ) external returns (string memory);
}

interface IWebsiteParseAgent {

    function ExtractString(
        string memory key,
        string memory description,
        string[] memory options,
        string memory prompt,
        string memory url,
        bool resolveUrl,
        uint8 numPages,
        uint8 confidenceThreshold
    )
        external
        returns (string memory);
}

interface ILLMAgent {

    function inferString(
        string memory prompt,
        string memory system,
        bool chainOfThought,
        string[] memory allowedValues
    )
        external
        returns (string memory);
}

/*
=========================================================
                    MAIN CONTRACT
=========================================================
*/

contract TruthGateOracle {

    /*
    =========================================================
                            CONFIG
    =========================================================
    */

    IAgentRequester public platform =
        IAgentRequester(
            0x037Bb9C718F3f7fe5eCBDB0b600D607b52706776
        );

    uint256 constant JSON_API_AGENT_ID =
        13174292974160097713;

    uint256 constant WEBSITE_PARSE_AGENT_ID =
        12875401142070969085;

    uint256 constant LLM_AGENT_ID =
        12847293847561029384;

    uint256 constant SUBCOMMITTEE_SIZE = 3;

    uint256 constant JSON_EXECUTION_COST =
        30000000000000000;

    uint256 constant WEBSITE_EXECUTION_COST =
        100000000000000000;

    uint256 constant LLM_EXECUTION_COST =
        70000000000000000;

    /*
    =========================================================
                        DATA STRUCTURES
    =========================================================
    */

    struct GithubReputation {

        string username;

        string bio;

        string createdAt;

        string portfolioUrl;

        string startupIdea;

        string portfolioSummary;

        string detectedTechStack;

        string aiVerdict;

        uint256 followers;

        uint256 following;

        uint256 publicRepos;

        uint256 aiScore;

        uint256 truthScore;

        bool analyzed;
    }

    /*
    =========================================================
                            STORAGE
    =========================================================
    */

    mapping(address => GithubReputation)
        public reputations;

    mapping(uint256 => address)
        public requestToUser;

    /*
    =========================================================
                        REQUEST TYPES
    =========================================================
    */

    enum RequestType {
        Followers,
        Repos,
        Following,
        Bio,
        CreatedAt,
        PortfolioSummary,
        TechStack,
        AIVerdict,
        AIScore
    }

    mapping(uint256 => RequestType)
        public requestTypes;

    /*
    =========================================================
                    COMPLETION TRACKING
    =========================================================
    */

    mapping(address => bool)
        public followersFetched;

    mapping(address => bool)
        public reposFetched;

    mapping(address => bool)
        public followingFetched;

    mapping(address => bool)
        public bioFetched;

    mapping(address => bool)
        public createdAtFetched;

    mapping(address => bool)
        public portfolioSummaryFetched;

    mapping(address => bool)
        public techStackFetched;

    mapping(address => bool)
        public aiVerdictRequested;

    mapping(address => bool)
        public aiVerdictFetched;

    mapping(address => bool)
        public aiScoreRequested;

    mapping(address => bool)
        public aiScoreFetched;

    /*
    =========================================================
                            EVENTS
    =========================================================
    */

    event FullAnalysisStarted(
        address indexed user,
        string username,
        string portfolioUrl,
        string startupIdea
    );

    event AnalysisStepCompleted(
        address indexed user,
        string field
    );

    event TruthScoreCalculated(
        address indexed user,
        uint256 score
    );

    event GithubAnalysisCompleted(
        address indexed user,
        uint256 truthScore
    );

    event AgentError(
        uint256 indexed requestId,
        ResponseStatus status
    );

    /*
    =========================================================
                        HELPERS
    =========================================================
    */

    function getRequiredDeposit()
        public
        view
        returns (uint256)
    {
        uint256 reserve =
            platform.getRequestDeposit();

        uint256 jsonReward =
            JSON_EXECUTION_COST *
            SUBCOMMITTEE_SIZE;

        uint256 websiteReward =
            WEBSITE_EXECUTION_COST *
            SUBCOMMITTEE_SIZE;

        uint256 llmReward =
            LLM_EXECUTION_COST *
            SUBCOMMITTEE_SIZE;

        return
            (reserve + jsonReward) * 5 +
            (reserve + websiteReward) * 2 +
            (reserve + llmReward) * 2;
    }

    function _buildUrl(
        string memory username
    )
        internal
        pure
        returns (string memory)
    {
        return string.concat(
            "https://api.github.com/users/",
            username
        );
    }

    /*
    =========================================================
                    MAIN ANALYSIS FUNCTION
    =========================================================
    */

    function analyzeCompleteProfile(
        string calldata username,
        string calldata portfolioUrl,
        string calldata startupIdea
    )
        external
        payable
    {

        require(
            msg.value >= getRequiredDeposit(),
            "Insufficient payment"
        );

        GithubReputation storage rep =
            reputations[msg.sender];

        rep.username = username;
        rep.portfolioUrl = portfolioUrl;
        rep.startupIdea = startupIdea;

        followersFetched[msg.sender] = false;
        reposFetched[msg.sender] = false;
        followingFetched[msg.sender] = false;
        bioFetched[msg.sender] = false;
        createdAtFetched[msg.sender] = false;

        portfolioSummaryFetched[msg.sender] = false;
        techStackFetched[msg.sender] = false;

        aiVerdictRequested[msg.sender] = false;
        aiVerdictFetched[msg.sender] = false;

        aiScoreFetched[msg.sender] = false;
        aiScoreRequested[msg.sender] = false;

        rep.analyzed = false;
        rep.truthScore = 0;
        rep.aiScore = 0;
        rep.aiVerdict = "";

        emit FullAnalysisStarted(
            msg.sender,
            username,
            portfolioUrl,
            startupIdea
        );

        uint256 jsonDeposit =
            platform.getRequestDeposit() +
            (
                JSON_EXECUTION_COST *
                SUBCOMMITTEE_SIZE
            );

        uint256 websiteDeposit =
            platform.getRequestDeposit() +
            (
                WEBSITE_EXECUTION_COST *
                SUBCOMMITTEE_SIZE
            );

        _requestFollowers(
            msg.sender,
            username,
            jsonDeposit
        );

        _requestRepos(
            msg.sender,
            username,
            jsonDeposit
        );

        _requestFollowing(
            msg.sender,
            username,
            jsonDeposit
        );

        _requestBio(
            msg.sender,
            username,
            jsonDeposit
        );

        _requestCreatedAt(
            msg.sender,
            username,
            jsonDeposit
        );

        _requestPortfolioSummary(
            msg.sender,
            portfolioUrl,
            websiteDeposit
        );

        _requestTechStack(
            msg.sender,
            portfolioUrl,
            websiteDeposit
        );
    }

    /*
    =========================================================
                    JSON API REQUESTS
    =========================================================
    */

    function _requestFollowers(
        address user,
        string memory username,
        uint256 deposit
    ) internal {

        bytes memory payload =
            abi.encodeWithSelector(
                IJsonApiAgent
                    .fetchUint
                    .selector,
                _buildUrl(username),
                "followers",
                0
            );

        _createRequest(
            JSON_API_AGENT_ID,
            payload,
            user,
            RequestType.Followers,
            deposit
        );
    }

    function _requestRepos(
        address user,
        string memory username,
        uint256 deposit
    ) internal {

        bytes memory payload =
            abi.encodeWithSelector(
                IJsonApiAgent
                    .fetchUint
                    .selector,
                _buildUrl(username),
                "public_repos",
                0
            );

        _createRequest(
            JSON_API_AGENT_ID,
            payload,
            user,
            RequestType.Repos,
            deposit
        );
    }

    function _requestFollowing(
        address user,
        string memory username,
        uint256 deposit
    ) internal {

        bytes memory payload =
            abi.encodeWithSelector(
                IJsonApiAgent
                    .fetchUint
                    .selector,
                _buildUrl(username),
                "following",
                0
            );

        _createRequest(
            JSON_API_AGENT_ID,
            payload,
            user,
            RequestType.Following,
            deposit
        );
    }

    function _requestBio(
        address user,
        string memory username,
        uint256 deposit
    ) internal {

        bytes memory payload =
            abi.encodeWithSelector(
                IJsonApiAgent
                    .fetchString
                    .selector,
                _buildUrl(username),
                "bio"
            );

        _createRequest(
            JSON_API_AGENT_ID,
            payload,
            user,
            RequestType.Bio,
            deposit
        );
    }

    function _requestCreatedAt(
        address user,
        string memory username,
        uint256 deposit
    ) internal {

        bytes memory payload =
            abi.encodeWithSelector(
                IJsonApiAgent
                    .fetchString
                    .selector,
                _buildUrl(username),
                "created_at"
            );

        _createRequest(
            JSON_API_AGENT_ID,
            payload,
            user,
            RequestType.CreatedAt,
            deposit
        );
    }

    /*
    =========================================================
                WEBSITE PARSE REQUESTS
    =========================================================
    */

    function _requestPortfolioSummary(
        address user,
        string memory portfolioUrl,
        uint256 deposit
    ) internal {

        string[] memory emptyOptions =
            new string[](0);

        bytes memory payload =
            abi.encodeWithSelector(
                IWebsiteParseAgent
                    .ExtractString
                    .selector,

                "portfolio_summary",

                "Developer portfolio summary",

                emptyOptions,

                "Analyze this developer portfolio website and summarize the builder credibility, projects, achievements, and engineering focus in 3 concise sentences.",

                portfolioUrl,

                true,

                3,

                70
            );

        _createRequest(
            WEBSITE_PARSE_AGENT_ID,
            payload,
            user,
            RequestType.PortfolioSummary,
            deposit
        );
    }

    function _requestTechStack(
        address user,
        string memory portfolioUrl,
        uint256 deposit
    ) internal {

        string[] memory emptyOptions =
            new string[](0);

        bytes memory payload =
            abi.encodeWithSelector(
                IWebsiteParseAgent
                    .ExtractString
                    .selector,

                "tech_stack",

                "Detected technologies",

                emptyOptions,

                "Extract the primary technologies, frameworks, blockchain tools, AI tools, and developer stack used in this portfolio website.",

                portfolioUrl,

                true,

                3,

                70
            );

        _createRequest(
            WEBSITE_PARSE_AGENT_ID,
            payload,
            user,
            RequestType.TechStack,
            deposit
        );
    }

    /*
    =========================================================
                    AI VERDICT REQUEST
    =========================================================
    */

    function _truncate(
        string memory str,
        uint256 maxLength
    )
        internal
        pure
        returns (string memory)
    {
        bytes memory strBytes = bytes(str);

        if (strBytes.length <= maxLength) {
            return str;
        }

        bytes memory result = new bytes(maxLength);

        for (uint256 i = 0; i < maxLength; i++) {
            result[i] = strBytes[i];
        }

        return string(result);
    }

    function _requestAIVerdict(
        address user,
        string memory username,
        string memory portfolioUrl,
        string memory startupIdea,
        uint256 deposit
    ) internal {

        GithubReputation storage rep =
            reputations[user];

        string memory prompt = string.concat(

            "Evaluate this startup founder.\n\n",

            "GitHub Followers: ",
            _uintToString(rep.followers),

            "\nPublic Repos: ",
            _uintToString(rep.publicRepos),

            "\nFollowing: ",
            _uintToString(rep.following),

            "\n\nPortfolio Summary: ",
            _truncate(rep.portfolioSummary, 180),

            "\n\nTech Stack: ",
            _truncate(rep.detectedTechStack, 120),

            "\n\nStartup Idea: ",
            _truncate(rep.startupIdea, 180),

            "\n\nReturn a concise verdict about:\n",
            "- technical credibility\n",
            "- innovation\n",
            "- execution capability\n",
            "- authenticity\n",
            "- founder potential\n\n",

            "Keep response under 150 words."
        );

        string memory system =
            "You are TruthGate AI. Evaluate technical credibility, innovation, execution capability, authenticity, and founder potential. Give a detailed verdict.";

        string[] memory emptyAllowed =
            new string[](0);

        bytes memory payload =
            abi.encodeWithSelector(
                ILLMAgent
                    .inferString
                    .selector,
                prompt,
                system,
                false,
                emptyAllowed
            );

        _createRequest(
            LLM_AGENT_ID,
            payload,
            user,
            RequestType.AIVerdict,
            deposit
        );
    }

    /*
    =========================================================
                    AI SCORE REQUEST
    =========================================================
    */

    function _requestAIScore(
        address user,
        uint256 deposit
    )
        internal
    {
        GithubReputation storage rep =
            reputations[user];

        string memory prompt = string.concat(

            "Evaluate this founder and startup.\n\n",

            "GitHub Followers: ",
            _uintToString(rep.followers),

            "\nRepos: ",
            _uintToString(rep.publicRepos),

            "\nFollowing: ",
            _uintToString(rep.following),

            "\n\nPortfolio Summary:\n",
            _truncate(rep.portfolioSummary, 250),

            "\n\nTech Stack:\n",
            _truncate(rep.detectedTechStack, 150),

            "\n\nStartup Idea:\n",
            _truncate(rep.startupIdea, 250),

            "\n\nReturn ONLY a number between 0 and 100."
        );

        string[] memory emptyAllowed =
            new string[](0);

        bytes memory payload =
            abi.encodeWithSelector(
                ILLMAgent.inferString.selector,
                prompt,
                "Return only a numeric score.",
                false,
                emptyAllowed
            );

        _createRequest(
            LLM_AGENT_ID,
            payload,
            user,
            RequestType.AIScore,
            deposit
        );
    }

    /*
    =========================================================
                    SCORE PARSER
    =========================================================
    */

    function _parseScore(
        string memory scoreString
    )
        internal
        pure
        returns (uint256)
    {
        bytes memory b =
            bytes(scoreString);

        uint256 result = 0;

        for (uint256 i = 0; i < b.length; i++) {
            if (
                b[i] >= 0x30 &&
                b[i] <= 0x39
            ) {
                result =
                    result *
                    10 +
                    (
                        uint8(b[i]) -
                        48
                    );
            }
        }

        if (result > 100) {
            result = 100;
        }

        return result;
    }

    /*
    =========================================================
                    INTERNAL REQUEST CREATOR
    =========================================================
    */

    function _createRequest(
        uint256 agentId,
        bytes memory payload,
        address user,
        RequestType requestType,
        uint256 deposit
    ) internal {

        uint256 requestId =
            platform.createRequest{
                value: deposit
            }(
                agentId,
                address(this),
                this.handleResponse.selector,
                payload
            );

        requestToUser[requestId] =
            user;

        requestTypes[requestId] =
            requestType;
    }

    /*
    =========================================================
                    UNIVERSAL CALLBACK
    =========================================================
    */

    function handleResponse(
        uint256 requestId,
        Response[] memory responses,
        ResponseStatus status,
        Request memory
    ) external {

        require(
            msg.sender ==
                address(platform),
            "Only platform"
        );

        if (
            status !=
            ResponseStatus.Success ||
            responses.length == 0
        ) {
            emit AgentError(
                requestId,
                status
            );

            return;
        }

        address user =
            requestToUser[
                requestId
            ];

        RequestType requestType =
            requestTypes[
                requestId
            ];

        GithubReputation storage rep =
            reputations[user];

        if (
            requestType ==
            RequestType.Followers
        ) {

            rep.followers =
                abi.decode(
                    responses[0].result,
                    (uint256)
                );

            followersFetched[user] =
                true;

            emit AnalysisStepCompleted(
                user,
                "followers"
            );
        }

        else if (
            requestType ==
            RequestType.Repos
        ) {

            rep.publicRepos =
                abi.decode(
                    responses[0].result,
                    (uint256)
                );

            reposFetched[user] =
                true;

            emit AnalysisStepCompleted(
                user,
                "repos"
            );
        }

        else if (
            requestType ==
            RequestType.Following
        ) {

            rep.following =
                abi.decode(
                    responses[0].result,
                    (uint256)
                );

            followingFetched[user] =
                true;

            emit AnalysisStepCompleted(
                user,
                "following"
            );
        }

        else if (
            requestType ==
            RequestType.Bio
        ) {

            rep.bio =
                abi.decode(
                    responses[0].result,
                    (string)
                );

            bioFetched[user] = true;

            emit AnalysisStepCompleted(
                user,
                "bio"
            );
        }

        else if (
            requestType ==
            RequestType.CreatedAt
        ) {

            rep.createdAt =
                abi.decode(
                    responses[0].result,
                    (string)
                );

            createdAtFetched[user] =
                true;

            emit AnalysisStepCompleted(
                user,
                "created_at"
            );
        }

        else if (
            requestType ==
            RequestType.PortfolioSummary
        ) {

            rep.portfolioSummary =
                abi.decode(
                    responses[0].result,
                    (string)
                );

            portfolioSummaryFetched[user] =
                true;

            emit AnalysisStepCompleted(
                user,
                "portfolio_summary"
            );
        }

        else if (
            requestType ==
            RequestType.TechStack
        ) {

            rep.detectedTechStack =
                abi.decode(
                    responses[0].result,
                    (string)
                );

            techStackFetched[user] =
                true;

            emit AnalysisStepCompleted(
                user,
                "tech_stack"
            );
        }

        else if (
            requestType ==
            RequestType.AIVerdict
        ) {

            rep.aiVerdict =
                abi.decode(
                    responses[0].result,
                    (string)
                );

            aiVerdictFetched[user] =
                true;

            emit AnalysisStepCompleted(
                user,
                "ai_verdict"
            );
        }

        else if (
            requestType ==
            RequestType.AIScore
        ) {

            string memory scoreText =
                abi.decode(
                    responses[0].result,
                    (string)
                );

            rep.aiScore =
                _parseScore(scoreText);

            aiScoreFetched[user] =
                true;

            emit AnalysisStepCompleted(
                user,
                "ai_score"
            );
        }

        _checkCompletion(user);
    }

    /*
    =========================================================
                    COMPLETION CHECK
    =========================================================
    */

    function _checkCompletion(
        address user
    ) internal {

        bool allDataReady =
            followersFetched[user] &&
            reposFetched[user] &&
            followingFetched[user] &&
            bioFetched[user] &&
            createdAtFetched[user] &&
            portfolioSummaryFetched[user] &&
            techStackFetched[user];

        // Step 1: once raw data is ready, request the AI verdict.
        if (
            allDataReady &&
            !aiVerdictRequested[user]
        ) {

            aiVerdictRequested[user] =
                true;

            GithubReputation storage rep =
                reputations[user];

            uint256 llmDeposit =
                platform.getRequestDeposit() +
                (
                    LLM_EXECUTION_COST *
                    SUBCOMMITTEE_SIZE
                );

            _requestAIVerdict(
                user,
                rep.username,
                rep.portfolioUrl,
                rep.startupIdea,
                llmDeposit
            );

            return;
        }

        // Step 2: once the verdict is in, request the numeric AI score.
        if (
            aiVerdictFetched[user] &&
            !aiScoreRequested[user]
        ) {

            aiScoreRequested[user] =
                true;

            uint256 llmDeposit =
                platform.getRequestDeposit() +
                (
                    LLM_EXECUTION_COST *
                    SUBCOMMITTEE_SIZE
                );

            _requestAIScore(
                user,
                llmDeposit
            );

            return;
        }

        // Step 3: once both the verdict and the score are in, finalize.
        if (
            aiVerdictFetched[user] &&
            aiScoreFetched[user]
        ) {

            reputations[user]
                .analyzed = true;

            _calculateTruthScore(
                user
            );

            emit GithubAnalysisCompleted(
                user,
                reputations[user]
                    .truthScore
            );
        }
    }

    /*
    =========================================================
                    TRUTH SCORE
    =========================================================
    */

    function _calculateTruthScore(
        address user
    ) internal {

        GithubReputation storage rep =
            reputations[user];

        rep.truthScore =
            rep.aiScore;

        emit TruthScoreCalculated(
            user,
            rep.truthScore
        );
    }

    /*
    =========================================================
                        VIEW FUNCTION
    =========================================================
    */

    function getReputation(
        address user
    )
        external
        view
        returns (
            GithubReputation memory
        )
    {
        return reputations[user];
    }

    /*
    =========================================================
                        UTIL
    =========================================================
    */

    function _uintToString(
        uint256 value
    )
        internal
        pure
        returns (string memory)
    {
        if (value == 0) {
            return "0";
        }

        uint256 temp = value;
        uint256 digits;

        while (temp != 0) {
            digits++;
            temp /= 10;
        }

        bytes memory buffer =
            new bytes(digits);

        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(
                uint8(
                    48 +
                    uint256(value % 10)
                )
            );
            value /= 10;
        }

        return string(buffer);
    }

    receive() external payable {}
}
