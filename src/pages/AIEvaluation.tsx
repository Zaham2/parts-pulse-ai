import { useState } from "react";
import { Upload, Camera, MessageSquare, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";

const AIEvaluation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedComponent, setSelectedComponent] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const componentTypes = [
    "Graphics Card (GPU)",
    "Processor (CPU)",
    "Memory (RAM)",
    "Storage (SSD/HDD)",
    "Motherboard",
    "Power Supply",
    "CPU Cooler",
    "Case",
    "Other"
  ];

  const questions = [
    "What is the exact model and brand?",
    "How long have you owned this component?",
    "What condition is it in? Any visible damage?",
    "Has it been overclocked or modified?",
    "Do you have the original packaging/accessories?",
    "Any warranty remaining?",
    "Why are you selling it?"
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setImages([...images, ...Array.from(files)]);
    }
  };

  const handleEvaluate = async () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setEvaluationResult({
        estimatedValue: 675,
        confidence: 92,
        condition: "Excellent",
        marketTrend: "Stable",
        suggestions: [
          "Consider listing at $650-$700 for quick sale",
          "Include original packaging to increase value",
          "Market demand is currently high for this model"
        ]
      });
      setIsProcessing(false);
      setCurrentStep(4);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
              AI Component Evaluation
            </h1>
            <p className="text-xl text-muted-foreground">
              Get an instant, accurate valuation of your PC component using advanced AI
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={(currentStep / 4) * 100} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>Component Type</span>
              <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>Upload Photos</span>
              <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>Provide Details</span>
              <span className={currentStep >= 4 ? "text-primary font-medium" : ""}>Get Results</span>
            </div>
          </div>

          {/* Step 1: Component Selection */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-ai-accent" />
                  What component are you evaluating?
                </CardTitle>
                <CardDescription>
                  Select the type of PC component you want to evaluate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select component type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {componentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedComponent}
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Photo Upload */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-6 h-6 mr-2 text-ai-accent" />
                  Upload Photos
                </CardTitle>
                <CardDescription>
                  Upload clear photos of your {selectedComponent.toLowerCase()} from multiple angles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Drag & drop images here</p>
                  <p className="text-muted-foreground mb-4">or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Choose Files
                    </label>
                  </Button>
                </div>

                {images.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">{images.length} image(s) uploaded</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {images.map((image, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-sm text-muted-foreground">{image.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => setCurrentStep(3)}
                    disabled={images.length === 0}
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Details */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2 text-ai-accent" />
                  Component Details
                </CardTitle>
                <CardDescription>
                  Answer these questions to help our AI provide the most accurate evaluation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={index} className="space-y-2">
                      <label className="text-sm font-medium">{question}</label>
                      <Textarea 
                        placeholder="Your answer..."
                        className="min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">💡 Pro Tips</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Be as detailed as possible for better accuracy</li>
                    <li>• Mention any issues, even minor ones</li>
                    <li>• Include purchase date if known</li>
                  </ul>
                </div>
                
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Back
                  </Button>
                  <Button 
                    variant="ai-accent"
                    className="flex-1"
                    onClick={handleEvaluate}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Get AI Evaluation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Processing & Results */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {isProcessing ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="animate-spin w-16 h-16 border-4 border-ai-accent border-t-transparent rounded-full mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold mb-2">AI is analyzing your component...</h3>
                    <p className="text-muted-foreground">This usually takes 30-60 seconds</p>
                  </CardContent>
                </Card>
              ) : evaluationResult && (
                <div className="space-y-6">
                  <Card className="border-ai-accent">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl">
                        <CheckCircle className="w-8 h-8 mr-3 text-ai-accent" />
                        Evaluation Complete
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="text-center p-6 bg-gradient-hero rounded-lg text-white">
                          <h3 className="text-lg font-medium mb-2">Estimated Value</h3>
                          <p className="text-4xl font-bold">${evaluationResult.estimatedValue}</p>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>AI Confidence</span>
                            <span className="font-semibold">{evaluationResult.confidence}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Condition</span>
                            <span className="font-semibold text-success">{evaluationResult.condition}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Market Trend</span>
                            <span className="font-semibold">{evaluationResult.marketTrend}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2 text-ai-accent" />
                          AI Recommendations
                        </h4>
                        <ul className="space-y-2">
                          {evaluationResult.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-ai-accent mr-2">•</span>
                              <span className="text-muted-foreground">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex space-x-4">
                        <Button variant="outline" onClick={() => setCurrentStep(1)}>
                          Evaluate Another Item
                        </Button>
                        <Button variant="ai-accent" className="flex-1">
                          List Item for Sale
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AIEvaluation;