var test = "test123456";
let emotionModel = new EmotionModel();
let mainView = new MainView(emotionModel);

let mainController = new MainController(
    mainView, 
    new EmotionDetectionController(), 
    new MainModel(), 
    new MainMenuView(), 
    new PathDrawingOverlayView(),
    emotionModel,
    new PathDrawingController(),
    new PlaybackController(),
    new RobotView(),
    new DonutView(),
    new AvailableRobotsController()
);