// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.36.6
// 	protoc        v6.30.2
// source: proto/multimedia.proto

package proto

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	timestamppb "google.golang.org/protobuf/types/known/timestamppb"
	reflect "reflect"
	sync "sync"
	unsafe "unsafe"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type PostInfo struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Id            string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *PostInfo) Reset() {
	*x = PostInfo{}
	mi := &file_proto_multimedia_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *PostInfo) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PostInfo) ProtoMessage() {}

func (x *PostInfo) ProtoReflect() protoreflect.Message {
	mi := &file_proto_multimedia_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use PostInfo.ProtoReflect.Descriptor instead.
func (*PostInfo) Descriptor() ([]byte, []int) {
	return file_proto_multimedia_proto_rawDescGZIP(), []int{0}
}

func (x *PostInfo) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

type UserInfo struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Id            string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *UserInfo) Reset() {
	*x = UserInfo{}
	mi := &file_proto_multimedia_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *UserInfo) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UserInfo) ProtoMessage() {}

func (x *UserInfo) ProtoReflect() protoreflect.Message {
	mi := &file_proto_multimedia_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UserInfo.ProtoReflect.Descriptor instead.
func (*UserInfo) Descriptor() ([]byte, []int) {
	return file_proto_multimedia_proto_rawDescGZIP(), []int{1}
}

func (x *UserInfo) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

type FileChunk struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Chunk         []byte                 `protobuf:"bytes,1,opt,name=chunk,proto3" json:"chunk,omitempty"`
	ResourceId    string                 `protobuf:"bytes,2,opt,name=resourceId,proto3" json:"resourceId,omitempty"`
	Ext           string                 `protobuf:"bytes,3,opt,name=ext,proto3" json:"ext,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *FileChunk) Reset() {
	*x = FileChunk{}
	mi := &file_proto_multimedia_proto_msgTypes[2]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *FileChunk) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*FileChunk) ProtoMessage() {}

func (x *FileChunk) ProtoReflect() protoreflect.Message {
	mi := &file_proto_multimedia_proto_msgTypes[2]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use FileChunk.ProtoReflect.Descriptor instead.
func (*FileChunk) Descriptor() ([]byte, []int) {
	return file_proto_multimedia_proto_rawDescGZIP(), []int{2}
}

func (x *FileChunk) GetChunk() []byte {
	if x != nil {
		return x.Chunk
	}
	return nil
}

func (x *FileChunk) GetResourceId() string {
	if x != nil {
		return x.ResourceId
	}
	return ""
}

func (x *FileChunk) GetExt() string {
	if x != nil {
		return x.Ext
	}
	return ""
}

type Post struct {
	state               protoimpl.MessageState `protogen:"open.v1"`
	Id                  string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Title               string                 `protobuf:"bytes,2,opt,name=title,proto3" json:"title,omitempty"`
	Description         string                 `protobuf:"bytes,3,opt,name=description,proto3" json:"description,omitempty"`
	Category            string                 `protobuf:"bytes,4,opt,name=category,proto3" json:"category,omitempty"`
	UserId              string                 `protobuf:"bytes,5,opt,name=userId,proto3" json:"userId,omitempty"`
	TimeStamp           *timestamppb.Timestamp `protobuf:"bytes,6,opt,name=timeStamp,proto3" json:"timeStamp,omitempty"`
	Status              string                 `protobuf:"bytes,7,opt,name=status,proto3" json:"status,omitempty"`
	MultimediaExtension string                 `protobuf:"bytes,8,opt,name=multimediaExtension,proto3" json:"multimediaExtension,omitempty"`
	unknownFields       protoimpl.UnknownFields
	sizeCache           protoimpl.SizeCache
}

func (x *Post) Reset() {
	*x = Post{}
	mi := &file_proto_multimedia_proto_msgTypes[3]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *Post) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Post) ProtoMessage() {}

func (x *Post) ProtoReflect() protoreflect.Message {
	mi := &file_proto_multimedia_proto_msgTypes[3]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Post.ProtoReflect.Descriptor instead.
func (*Post) Descriptor() ([]byte, []int) {
	return file_proto_multimedia_proto_rawDescGZIP(), []int{3}
}

func (x *Post) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *Post) GetTitle() string {
	if x != nil {
		return x.Title
	}
	return ""
}

func (x *Post) GetDescription() string {
	if x != nil {
		return x.Description
	}
	return ""
}

func (x *Post) GetCategory() string {
	if x != nil {
		return x.Category
	}
	return ""
}

func (x *Post) GetUserId() string {
	if x != nil {
		return x.UserId
	}
	return ""
}

func (x *Post) GetTimeStamp() *timestamppb.Timestamp {
	if x != nil {
		return x.TimeStamp
	}
	return nil
}

func (x *Post) GetStatus() string {
	if x != nil {
		return x.Status
	}
	return ""
}

func (x *Post) GetMultimediaExtension() string {
	if x != nil {
		return x.MultimediaExtension
	}
	return ""
}

var File_proto_multimedia_proto protoreflect.FileDescriptor

const file_proto_multimedia_proto_rawDesc = "" +
	"\n" +
	"\x16proto/multimedia.proto\x12\x11MultimediaService\x1a\x1fgoogle/protobuf/timestamp.proto\"\x1a\n" +
	"\bPostInfo\x12\x0e\n" +
	"\x02id\x18\x01 \x01(\tR\x02id\"\x1a\n" +
	"\bUserInfo\x12\x0e\n" +
	"\x02id\x18\x01 \x01(\tR\x02id\"S\n" +
	"\tFileChunk\x12\x14\n" +
	"\x05chunk\x18\x01 \x01(\fR\x05chunk\x12\x1e\n" +
	"\n" +
	"resourceId\x18\x02 \x01(\tR\n" +
	"resourceId\x12\x10\n" +
	"\x03ext\x18\x03 \x01(\tR\x03ext\"\x86\x02\n" +
	"\x04Post\x12\x0e\n" +
	"\x02id\x18\x01 \x01(\tR\x02id\x12\x14\n" +
	"\x05title\x18\x02 \x01(\tR\x05title\x12 \n" +
	"\vdescription\x18\x03 \x01(\tR\vdescription\x12\x1a\n" +
	"\bcategory\x18\x04 \x01(\tR\bcategory\x12\x16\n" +
	"\x06userId\x18\x05 \x01(\tR\x06userId\x128\n" +
	"\ttimeStamp\x18\x06 \x01(\v2\x1a.google.protobuf.TimestampR\ttimeStamp\x12\x16\n" +
	"\x06status\x18\a \x01(\tR\x06status\x120\n" +
	"\x13multimediaExtension\x18\b \x01(\tR\x13multimediaExtension2\xa1\x03\n" +
	"\x11MultimediaService\x12P\n" +
	"\x11GetPostMultimedia\x12\x1b.MultimediaService.PostInfo\x1a\x1c.MultimediaService.FileChunk0\x01\x12R\n" +
	"\x13GetUserProfileImage\x12\x1b.MultimediaService.UserInfo\x1a\x1c.MultimediaService.FileChunk0\x01\x12>\n" +
	"\n" +
	"CreatePost\x12\x17.MultimediaService.Post\x1a\x17.MultimediaService.Post\x12S\n" +
	"\x14UploadPostMultimedia\x12\x1c.MultimediaService.FileChunk\x1a\x1b.MultimediaService.PostInfo(\x01\x12Q\n" +
	"\x12UploadProfileImage\x12\x1c.MultimediaService.FileChunk\x1a\x1b.MultimediaService.UserInfo(\x01B\tZ\a./protob\x06proto3"

var (
	file_proto_multimedia_proto_rawDescOnce sync.Once
	file_proto_multimedia_proto_rawDescData []byte
)

func file_proto_multimedia_proto_rawDescGZIP() []byte {
	file_proto_multimedia_proto_rawDescOnce.Do(func() {
		file_proto_multimedia_proto_rawDescData = protoimpl.X.CompressGZIP(unsafe.Slice(unsafe.StringData(file_proto_multimedia_proto_rawDesc), len(file_proto_multimedia_proto_rawDesc)))
	})
	return file_proto_multimedia_proto_rawDescData
}

var file_proto_multimedia_proto_msgTypes = make([]protoimpl.MessageInfo, 4)
var file_proto_multimedia_proto_goTypes = []any{
	(*PostInfo)(nil),              // 0: MultimediaService.PostInfo
	(*UserInfo)(nil),              // 1: MultimediaService.UserInfo
	(*FileChunk)(nil),             // 2: MultimediaService.FileChunk
	(*Post)(nil),                  // 3: MultimediaService.Post
	(*timestamppb.Timestamp)(nil), // 4: google.protobuf.Timestamp
}
var file_proto_multimedia_proto_depIdxs = []int32{
	4, // 0: MultimediaService.Post.timeStamp:type_name -> google.protobuf.Timestamp
	0, // 1: MultimediaService.MultimediaService.GetPostMultimedia:input_type -> MultimediaService.PostInfo
	1, // 2: MultimediaService.MultimediaService.GetUserProfileImage:input_type -> MultimediaService.UserInfo
	3, // 3: MultimediaService.MultimediaService.CreatePost:input_type -> MultimediaService.Post
	2, // 4: MultimediaService.MultimediaService.UploadPostMultimedia:input_type -> MultimediaService.FileChunk
	2, // 5: MultimediaService.MultimediaService.UploadProfileImage:input_type -> MultimediaService.FileChunk
	2, // 6: MultimediaService.MultimediaService.GetPostMultimedia:output_type -> MultimediaService.FileChunk
	2, // 7: MultimediaService.MultimediaService.GetUserProfileImage:output_type -> MultimediaService.FileChunk
	3, // 8: MultimediaService.MultimediaService.CreatePost:output_type -> MultimediaService.Post
	0, // 9: MultimediaService.MultimediaService.UploadPostMultimedia:output_type -> MultimediaService.PostInfo
	1, // 10: MultimediaService.MultimediaService.UploadProfileImage:output_type -> MultimediaService.UserInfo
	6, // [6:11] is the sub-list for method output_type
	1, // [1:6] is the sub-list for method input_type
	1, // [1:1] is the sub-list for extension type_name
	1, // [1:1] is the sub-list for extension extendee
	0, // [0:1] is the sub-list for field type_name
}

func init() { file_proto_multimedia_proto_init() }
func file_proto_multimedia_proto_init() {
	if File_proto_multimedia_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: unsafe.Slice(unsafe.StringData(file_proto_multimedia_proto_rawDesc), len(file_proto_multimedia_proto_rawDesc)),
			NumEnums:      0,
			NumMessages:   4,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_proto_multimedia_proto_goTypes,
		DependencyIndexes: file_proto_multimedia_proto_depIdxs,
		MessageInfos:      file_proto_multimedia_proto_msgTypes,
	}.Build()
	File_proto_multimedia_proto = out.File
	file_proto_multimedia_proto_goTypes = nil
	file_proto_multimedia_proto_depIdxs = nil
}
