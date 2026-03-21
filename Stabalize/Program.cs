using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.IO;
using System.Reflection;

namespace FFHelper
{    
    public class FFHelper
    {
        const string ffmpeg_exe = "ffmpeg.exe";
        public static int Main(string[] args)
        {
            if (!File.Exists(ffmpeg_exe))
            {
                Console.WriteLine($"{ffmpeg_exe} could not be found");
                return 100000;
            }

            if (args == null || args?.Length < 2)
            {
                Console.WriteLine("Usage:");
                Console.WriteLine("FFHelper.exe [operation] [options]");
                Console.WriteLine("Operations:");
                Console.WriteLine("   -s [input_file] - Stabalize Video");
                Console.WriteLine("   -x [factor] [input_file] - Speed Up Video by Factor");
                Console.WriteLine("   -1080 [input_file] - Scale Video to 1080P");
                Console.WriteLine("   -ts [input_file] [hh:mm:ss] - Trim Start of Video");
                Console.WriteLine("   -te [input_file] [hh:mm:ss] - Trim End of Video");    
                Console.WriteLine("   -c [folder] - Concat Videos in Folder. Files cannot have spaces in the name");
                return 100001;
            }

            if (args![0] == "-s")
            {
                return Stabalize(args.Skip(1).ToArray());
            }

            if (args[0].StartsWith("-x"))
            {
                return SpeedUp(args);
            }

            if (args[0] == "-c")
            {
                return Concat(args.Skip(1).ToArray());
            }


            if (args[0] == "-1080")
            {
                return Scale(args.Skip(1).ToArray());
            }

            if (args[0] == "-ts")
            {                
                return TrimStart(args.Skip(1).ToArray());
            }

            if (args[0] == "-te")
            {
                return TrimEnd(args.Skip(1).ToArray());
            }

            Console.WriteLine($"Unknown Options {args[0]}");
            return -1;
        }

        public static int TrimStart(string[] args)
        {
            if (args?.Length != 2)
            {
                Console.WriteLine("Usage:");
                Console.WriteLine("FFHelper.exe -ts [input_file] [hh:mm:ss]");
                return 30;
            }

            var input = args[0];
            if (!File.Exists(input))
            {
                Console.WriteLine($"{input} does not exist");
                return 31;
            }
            var path = Path.GetDirectoryName(input)!;
            var output = Path.Combine(path, Path.GetFileNameWithoutExtension(input));
            output += $"_Trimmed{Path.GetExtension(input)}";
            if (File.Exists(output))
            {
                File.Delete(output);
            }

            Console.WriteLine("====================================================");
            Console.WriteLine( "| Trim Start");
            Console.WriteLine($"| Input File: {input}");
            Console.WriteLine($"| Start:      {args[1]}");
            Console.WriteLine("====================================================");


            return RunLocal($"-i {input} -ss {args[1]} -c copy {output}");
        }



        public static int TrimEnd(string[] args)
        {
            if (args?.Length != 2)
            {
                Console.WriteLine("Usage:");
                Console.WriteLine("FFHelper.exe -te [input_file] [hh:mm:ss]");
                return 30;
            }

            var input = args[0];
            if (!File.Exists(input))
            {
                Console.WriteLine($"{input} does not exist");
                return 31;
            }
            var path = Path.GetDirectoryName(input)!;
            var output = Path.Combine(path, Path.GetFileNameWithoutExtension(input));
            output += $"_Trimmed{Path.GetExtension(input)}";
            if (File.Exists(output))
            {
                File.Delete(output);
            }

            Console.WriteLine("====================================================");
            Console.WriteLine("| Trim End");
            Console.WriteLine($"| Input File: {input}");
            Console.WriteLine($"| Start:      {args[1]}");
            Console.WriteLine("====================================================");


            return RunLocal($"-i {input} -ss 00:00:00 -to {args[1]} -c copy {output}");
        }

        public static int Scale(string[] args)
        {
            if (args?.Length != 1)
            {
                Console.WriteLine("Usage:");
                Console.WriteLine("FFHelper.exe -1080 [input_file]");
                return 30;
            }

            var input = args[0];
            if (!File.Exists(input))
            {
                Console.WriteLine($"{input} does not exist");
                return 31;
            }
            var path = Path.GetDirectoryName(input)!;
            var output = Path.Combine(path, Path.GetFileNameWithoutExtension(input));
            output += $"_1080{Path.GetExtension(input)}";
            if (File.Exists(output))
            {
                File.Delete(output);
            }

            Console.WriteLine("====================================================");
            Console.WriteLine("| Scale to 1080P");
            Console.WriteLine($"| Input File: {input}");
            Console.WriteLine($"| Output File: {output}");
            Console.WriteLine("====================================================");


            return RunLocal($"-i {input} -vf scale=1920:1080 -c:a copy {output}");
        }

        public static int Concat(string[] args)
        {
            if (args?.Length != 1)
            {
                Console.WriteLine("Usage:");
                Console.WriteLine("FFHelper.exe -c [Folder]");
                return 20;
            }

            var folder = args[0];
            if (!Directory.Exists(folder))
            {
                Console.WriteLine($"{folder} does not exist");
            }

            Console.WriteLine("====================================================");
            Console.WriteLine("| Concatenate Videos");
            Console.WriteLine($"| Input Folder: {folder}");

            var concat_file = Path.Combine(folder, "concat.txt");
            using (var fs = File.CreateText(concat_file))
            {
                foreach (var mp4 in Directory.GetFiles(folder, "*.mp4"))
                {
                    var file = Path.GetFileName(mp4);
                    fs.WriteLine($"file '{file}'");
                    Console.WriteLine($"|\t{file}");
                }
                fs.Close();
            }

            var output = args[0]+".mp4";
            if (File.Exists(output))
            {
                File.Delete(output);
            }

            Console.WriteLine($"| Output File: {output}");
            Console.WriteLine("====================================================");


            var result = RunLocal($"-f concat -i {concat_file} -c copy {output}");

            File.Delete(concat_file);

            return result;
        }

        public static int SpeedUp(string[] args)
        {
            if (args?.Length != 2 || args[0].Length < 3)
            {
                Console.WriteLine("Usage:");
                Console.WriteLine("FFHelper.exe -x [factor] [input_file]");
                return 10;
            }

            var factor = args[0].Replace("-x", string.Empty)?.Trim();
            if (!int.TryParse(factor, out var speed_factor))
            {
                Console.WriteLine("Usage:");
                Console.WriteLine("FFHelper.exe -x [factor:int] [input_file]");
                return 11;
            }

            var input = args[1];
            if (!File.Exists(input))
            {
                Console.WriteLine($"{input} does not exist");
                return 12;
            }
            var path = Path.GetDirectoryName(input)!;
            var output = Path.Combine(path, Path.GetFileNameWithoutExtension(input));
            output += $"_{speed_factor}X{Path.GetExtension(input)}";
            if (File.Exists(output))
            {
                File.Delete(output);
            }

            Console.WriteLine("====================================================");
            Console.WriteLine($"| Speed Up {speed_factor}X");
            Console.WriteLine($"| Input File: {input}");
            Console.WriteLine($"| Output File: {output}");
            Console.WriteLine("====================================================");

            return RunLocal($"-i {input} -vf \"setpts=(PTS-STARTPTS)/{speed_factor}\" -an -crf 18 {output}");
        }

        public static int Stabalize(string[] args)
        {
            if (args?.Length != 1)
            {
                Console.WriteLine("Usage:");
                Console.WriteLine("FFHelper.exe -s [input_file]");
                return 2;
            }

            var input = args![0];
            if (!File.Exists(input))
            {
                Console.WriteLine($"{input} does not exist");
                return 3;
            }


            var path = Path.GetDirectoryName(input)!;
            var output = Path.Combine(path, Path.GetFileNameWithoutExtension(input));
            output += $"_stablized{Path.GetExtension(input)}";

            Console.WriteLine("====================================================");
            Console.WriteLine($"| Stabalize");
            Console.WriteLine($"| Input File: {input}");
            Console.WriteLine($"| Output File: {output}");
            Console.WriteLine("====================================================");

            DeleteAll($"{Path.Combine(path, "*.trf")}");
            if (File.Exists(output))
                File.Delete(output);

            Console.WriteLine("Step 1 - Analyzing Video");
            var stepA = RunLocal($"-i {input} -vf vidstabdetect -f null -");
            if (stepA != 0)
            {
                Console.WriteLine($"Analysis step failed with code {stepA}");
                DeleteAll($"{Path.Combine(path, "*.trf")}");
                return 4;
            }

            Console.WriteLine("Step 2 - Stabalizing Video");
            var result = RunLocal($" -i {input} -an -vf vidstabtransform {output}");
            if (result == 0)
                DeleteAll($"{Path.Combine(path, "*.trf")}");

            return result;
        }

        private static int RunLocal(string args, string? subFolder = null)
        {
            var cd = Directory.GetCurrentDirectory();
            if (subFolder != null && Directory.Exists(subFolder))
            {
                cd = Path.Combine(cd, subFolder);
                File.Copy(ffmpeg_exe, Path.Combine(cd, ffmpeg_exe), true);
            }

            Console.WriteLine($"Starting {Path.Combine(cd, ffmpeg_exe)} {args}");
            var si = new ProcessStartInfo()
            {
                Arguments = args,
                FileName = ffmpeg_exe,
                CreateNoWindow = false,
                WorkingDirectory = cd,
                UseShellExecute = true,
            };

            var result = new Process()
            {
                StartInfo = si
            };
            result.Start();
            result.PriorityClass = ProcessPriorityClass.BelowNormal;
            result.WaitForExit();

            if (subFolder != null && cd.Contains(subFolder) && cd != subFolder)
            {
                File.Delete(ffmpeg_exe);
            }

            if (result.ExitCode != 0)
            {
                Console.WriteLine($"{ffmpeg_exe} failed with code {result.ExitCode}");
                return 32;
            }


            return result.ExitCode;
        }

        private static void DeleteAll(string pattern)
        {
            var path = Path.GetDirectoryName(pattern);
            if (string.IsNullOrEmpty(path))
                path = Directory.GetCurrentDirectory();
            foreach (string f in Directory.EnumerateFiles(path, pattern.Replace(path, string.Empty)))
            {
                File.Delete(f);
            }
        }
    }
}

